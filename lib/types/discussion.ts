export interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  userId: string;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  isHidden: boolean;
  tags: string[];
  user?: {
    name: string | null;
  };
}

export interface DiscussionReply {
  id: string;
  threadId: string;
  userId: string;
  content: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  isHidden: boolean;
  user?: {
    name: string | null;
  };
}

export interface DiscussionLike {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'thread' | 'reply';
  createdAt: string;
}