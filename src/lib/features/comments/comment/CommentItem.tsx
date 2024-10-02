'use client';

import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';
import {
  CommentContext,
  CommentItemProps,
  CommentWithRepiesAndAuthor,
} from './types';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquareText,
  EllipsisVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import CommentForm from './CommentForm';
import { useToastContext } from '@/contexts/toast.context';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cn, getErrorMessage, setCursorToEnd } from '@/lib/utils';
import {
  CommentAnswers,
  CommentAnswersContent,
  CommentAnswersTrigger,
} from './Answers';
import useAutoResizeHeight from '@/hooks/useAutoResizeHeight';
import { toast } from '@/components/ui/use-toast';
import { formatDistance } from 'date-fns';
import {
  useAddReplieMutation,
  useDeleteCommentMutation,
  useGetRepliesQuery,
  useUpdateCommentMutation,
} from '@/lib/features/comments/comment.slice';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const commentContext = createContext<CommentContext | null>(null);

function CommentProvider({ children }: { children: ReactNode }) {
  const [replyMode, setReplyMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  return (
    <commentContext.Provider
      value={{ replyMode, setReplyMode, editMode, setEditMode }}
    >
      {children}
    </commentContext.Provider>
  );
}

function useCommentContext() {
  const context = useContext(commentContext);
  if (!context)
    throw new Error(
      'useContext(commentContext) should be used in CommentContextProvider'
    );
  return context;
}

function Comment({ children }: { children: ReactNode }) {
  return (
    <CommentProvider>
      <div>{children}</div>
    </CommentProvider>
  );
}
// Context ends

function CommentContent({ comment }: { comment: CommentWithRepiesAndAuthor }) {
  const { editMode, setEditMode } = useCommentContext();
  const [value, setValue] = useState(comment.content);
  const creationDate = formatDistance(comment.createdAt, new Date(), {
    addSuffix: true,
  });
  const textarea = useAutoResizeHeight(value);
  const [updateComment] = useUpdateCommentMutation();
  const toast = useToastContext();

  function _handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      updateComment({
        id: comment.id,
        data: {
          content: value,
        },
      }).unwrap();
    } catch (error) {
      const message = getErrorMessage(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong with reactions.',
        description: message,
      });
    }
    setEditMode(false);
  }

  function _handleCancel() {
    setEditMode(false);
  }

  return editMode ? (
    <form className="flex flex-col flex-1" onSubmit={_handleSubmit}>
      <textarea
        ref={textarea}
        rows={1}
        className="resize-none overflow-hidden text-muted-foreground outline-none comment-placeholder border-b-2 border-slate-600 focus:border-blue-500"
        autoFocus={true}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        onFocus={(e) => setCursorToEnd(e.target)}
      />
      <div className="flex mt-2">
        <Button
          className="ml-auto rounded-full px-5"
          size="sm"
          variant="secondary"
          onClick={_handleCancel}
          type="button"
        >
          Cancel
        </Button>
        <Button
          className="mx-2 rounded-full px-5"
          size="sm"
          disabled={!value.trim()}
          type="submit"
        >
          Save
        </Button>
      </div>
    </form>
  ) : (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <div className="font-medium">{comment.author.username}</div>
        <div className="text-xs text-muted-foreground">{creationDate}</div>
      </div>
      <p className="break-words">{comment.content}</p>
      <div className="flex mt-2">
        <CommentFeedbackButtons comment={comment} />
      </div>
    </div>
  );
}

function CommentOptions({
  commentId,
  commentAuthorEmail,
}: {
  commentId: string;
  commentAuthorEmail: string;
}) {
  const toast = useToastContext();
  const { setEditMode, editMode } = useCommentContext();
  const [deleteComment] = useDeleteCommentMutation();
  const handleEdit = () => {
    setEditMode(true);
  };
  const { data } = useSession();

  const handleDelete = async () => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      const message = getErrorMessage(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong with reactions.',
        description: message,
      });
    }
  };

  return !editMode && data?.user?.email === commentAuthorEmail ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="my-auto">
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className="size-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash2 className="size-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
}

function CommentFeedbackButtons({
  comment,
}: {
  comment: CommentWithRepiesAndAuthor;
}) {
  const [userReaction, setUserReaction] = useState<'none' | 'like' | 'dislike'>(
    'none'
  );
  const [updateComment, { isLoading }] = useUpdateCommentMutation();
  const [likes, setLikes] = useState(comment.likes);
  const [disLikes, setDisLikes] = useState(comment.disLikes);
  const { setReplyMode, editMode } = useCommentContext();

  const handleLike = async () => {
    if (userReaction === 'like') return;

    if (userReaction === 'dislike') {
      setDisLikes((prev) => prev - 1);

      try {
        await updateComment({
          id: comment.id,
          data: {
            disLikes: {
              decrement: 1,
            },
          },
        });
      } catch (error) {
        const message = getErrorMessage(error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong with reactions.',
          description: message,
        });
      }
    }

    setLikes((prev) => prev + 1);
    setUserReaction('like');

    try {
      await updateComment({
        id: comment.id,
        data: {
          likes: {
            increment: 1,
          },
        },
      }).unwrap();
    } catch (error) {
      const message = getErrorMessage(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong with reactions.',
        description: message,
      });
    }
  };
  // ако си го натиснал веднъж, да се махне, ако си бил до са на лайк, да се махне лайка и да се обнови дислайка
  const handleDisLike = async () => {
    if (userReaction === 'dislike') return;

    if (userReaction === 'like') {
      setLikes((prev) => prev - 1);
      try {
        await updateComment({
          id: comment.id,
          data: {
            likes: {
              decrement: 1,
            },
          },
        });
      } catch (error) {
        const message = getErrorMessage(error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong with reactions.',
          description: message,
        });
      }
    }

    setDisLikes((prev) => prev + 1);
    setUserReaction('dislike');

    try {
      await updateComment({
        id: comment.id,
        data: {
          disLikes: {
            increment: 1,
          },
        },
      }).unwrap();
    } catch (error) {
      const message = getErrorMessage(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong with reactions.',
        description: message,
      });
    }
  };

  return (
    !editMode && (
      <div className="flex items-center">
        <Button
          variant={userReaction === 'like' ? 'secondary' : 'ghost'}
          onClick={handleLike}
          disabled={isLoading}
        >
          <ThumbsUp className="size-4" />
          <span className="ml-2 text-sm text-muted-foreground">{likes}</span>
        </Button>
        <Button
          variant={userReaction === 'dislike' ? 'secondary' : 'ghost'}
          onClick={handleDisLike}
        >
          <ThumbsDown className="size-4" />
          <span className="ml-2 text-sm text-muted-foreground">{disLikes}</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setReplyMode(true)}
          disabled={isLoading}
        >
          <span className="max-sm:hidden">Answer</span>
          <MessageSquareText className="hidden max-sm:block size-5" />
        </Button>
      </div>
    )
  );
}

function ReplyForm({ parentId, postId }: { parentId: string; postId: string }) {
  const { replyMode, setReplyMode } = useCommentContext();
  const [createReplie, { isLoading }] = useAddReplieMutation();
  return (
    replyMode && (
      <div className="border-l box-border pl-4">
        <CommentForm
          handleCancel={() => setReplyMode(false)}
          autoFocus={true}
          handleSubmit={async (value) => {
            await createReplie({ parentId, postId, content: value });
            setReplyMode(false);
          }}
        />
      </div>
    )
  );
}
//micro-components ends

export default function CommentItem({
  comment,
  className,
}: CommentItemProps) {
  const { data: replies } = useGetRepliesQuery(comment.id);
  const {postId} = comment;
  return (
    <Comment>
      <div className={cn(' box-border py-1 flex gap-4 items-start', className)}>
        <Avatar>
          <AvatarImage src={comment.author?.image || undefined} />
          <AvatarFallback>BC</AvatarFallback>
        </Avatar>

        <CommentContent comment={comment} />

        <div>
          <CommentOptions
            commentId={comment.id}
            commentAuthorEmail={comment.author.email}
          />
        </div>
      </div>
      <ReplyForm parentId={comment.id} postId={postId} />
      {replies && replies.length > 0 && (
        <CommentAnswers postId={postId}>
          <CommentAnswersTrigger>
            {replies.length} Answers
          </CommentAnswersTrigger>
          <div className="pl-5">
            {replies.map((reply) => (
              <CommentAnswersContent key={reply.id} reply={reply} />
            ))}
          </div>
        </CommentAnswers>
      )}
    </Comment>
  );
}