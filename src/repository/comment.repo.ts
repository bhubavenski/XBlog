import { db } from '@/prisma/db';
import { Prisma } from '@prisma/client';

export class CommentRepo {
  static async update<T extends Prisma.CommentUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.CommentUpdateArgs>
  ): Promise<Prisma.CommentGetPayload<T>> {
    return await db.comment.update(args);
  }

  static async delete<T extends Prisma.CommentDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.CommentDeleteArgs>
  ): Promise<Prisma.CommentGetPayload<T>> {
    return await db.comment.delete(args);
  }

  static async create<T extends Prisma.CommentCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.CommentCreateArgs>
  ): Promise<Prisma.CommentGetPayload<T>> {
    return await db.comment.create(args);
  }
}