import { ReactNode } from 'react';

export type CommentProps = {
  className?: string;
  children: ReactNode;
  isInEditMode?: boolean;
};

export type CommentAvatarProps = {
  className?: string;
  username: string;
  userImg: string;
};

export type CommentContentProps = {
  className?: string;
  children: ReactNode;
};

export type CommentContext = {
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  descriptionFieldRef: React.MutableRefObject<HTMLParagraphElement | null>;
};

export type EditModeActionsProps = {
  render: ({
    setEditMode,
    descriptionFieldRef,
    editMode,
  }: {
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    descriptionFieldRef: React.MutableRefObject<HTMLParagraphElement | null>;
    editMode: boolean;
  }) => ReactNode;
};
