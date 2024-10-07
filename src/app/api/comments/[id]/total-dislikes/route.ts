import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/prisma/db';
import { getErrorMessage, validateSchema } from '@/lib/utils';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { checkIfCommentIsDisLiked, checkIfCommentIsLiked } from '../lib';
import { CommentIdSchema } from '@/resolvers/comment.resolver';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const validatiedFields = validateSchema(CommentIdSchema, body);

  if ('error' in validatiedFields) {
    return NextResponse.json(
      { error: validatiedFields.error },
      { status: 400 } // 400 Bad Request
    );
  }

  const { commentId } = validatiedFields.data;

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.sub) {
    return NextResponse.json(
      { error: 'Authentication required: Please log in to post a comment' },
      { status: 401 } // 401 Unauthorized
    );
  }

  const { data: disLikeData, error: disLikeError } =
    await checkIfCommentIsDisLiked(commentId, session.user.sub);
  if (disLikeData) {
    return NextResponse.json(
      { error: 'Can not dislike a comment more than once' },
      { status: 500 } // 500 Internal Server Error
    );
  }
  if (disLikeError) {
    return NextResponse.json(
      { error: disLikeError },
      { status: 500 } // 500 Internal Server Error
    );
  }

  const { data: likeData, error: likeError } = await checkIfCommentIsLiked(
    commentId,

    session.user.sub
  );
  if (likeData) {
    try {
      await db.commentLike.delete({
        where: {
          authorId_commentId: {
            authorId: session.user.sub,
            commentId,
          },
        },
      });
    } catch (error) {
      console.error(error);
      const message = getErrorMessage(error);
      return NextResponse.json(
        { error: 'Unable to delete like: ' + message },
        { status: 500 } // 500 Internal Server Error
      );
    }
  }
  if (likeError) {
    return NextResponse.json(
      { error: likeError },
      { status: 500 } // 500 Internal Server Error
    );
  }

  try {
    const [dislike, updatedComment] = await db.$transaction([
      db.commentDisLike.create({
        data: {
          authorId: session.user.sub,
          commentId,
        },
      }),
      db.comment.update({
        where: { id: commentId },
        data: {
          totalDisLikes: { increment: 1 },
          totalLikes: likeData ? { decrement: 1 } : undefined,
        },
      }),
    ]);

    return NextResponse.json(
      updatedComment,
      { status: 200 } // 200 OK
    );
  } catch (error) {
    console.error(error);
    const message = getErrorMessage(error);
    return NextResponse.json(
      { error: 'Unable to process dislike and update comment: ' + message },
      { status: 500 } // 500 Internal Server Error
    );
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  const validatedFields = validateSchema(CommentIdSchema, body);

  if ('error' in validatedFields) {
    return NextResponse.json(
      { error: validatedFields.error },
      { status: 400 } // 400 Bad Request
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.sub) {
    return NextResponse.json(
      { error: 'Authentication required: Please log in to post a comment' },
      { status: 401 } // 401 Unauthorized
    );
  }
  const { commentId } = validatedFields.data;

  try {
    await db.commentDisLike.delete({
      where: {
        authorId_commentId: {
          authorId: session.user.sub,
          commentId,
        },
      },
    });
    return NextResponse.json(
      { message: 'Comment like delete successfully', id: commentId },
      { status: 200 } // 200 OK
    );
  } catch (error) {
    console.error(error);
    const message = getErrorMessage(error);
    return NextResponse.json(
      { error: 'Unable to dislike comment: ' + message },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
