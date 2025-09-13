// Forum Management Types
export interface ThreadResponse {
  id: string;
  authorId: string;
  authorName: string;
  authorSpecialization: string;
  title: string;
  content: string;
  tags: string[];
  type: string;
  viewCount: number;
  replyCount: number;
  upvoteCount: number;
  bookmarkCount: number;
  isActive: boolean;
  isClosed: boolean;
  isAnonymous: boolean;
  closedReason?: string;
  createdAt: string;
  updatedAt: string;
  lastRepliedAt?: string;
  isBookmarked: boolean;
  userVote: number;
  recentReplies: ReplyResponse[];
}

export interface ReplyResponse {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorSpecialization: string;
  content: string;
  upvoteCount: number;
  isActive: boolean;
  isSolution: boolean;
  isAnonymous: boolean;
  parentReplyId?: string;
  createdAt: string;
  updatedAt: string;
  userVote: number;
  childReplies: ReplyResponse[];
}

export interface CreateThreadRequest {
  title: string;
  content: string;
  tags: string[];
  type?: string;
  isAnonymous?: boolean;
}

export interface ThreadFilterRequest {
  tags?: string[];
  type?: string;
  status?: string;
  authorId?: string;
  bookmarked?: boolean;
  participated?: boolean;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
}

export interface UpdateThreadRequest {
  title?: string;
  content?: string;
  tags?: string[];
  isClosed?: boolean;
  closedReason?: string;
}

export interface CreateReplyRequest {
  content: string;
  parentReplyId?: string;
  isAnonymous?: boolean;
  isSolution?: boolean;
}

export interface BookmarkResponse {
  id: string;
  threadId: string;
  threadTitle: string;
  bookmarkedAt: string;
}

export interface VoteResponse {
  id: string;
  threadId?: string;
  replyId?: string;
  voteType: string;
  newUpvoteCount: number;
  createdAt: string;
}

export interface VoteRequest {
  voteType: "UPVOTE" | "DOWNVOTE" | "NEUTRAL";
}

export interface TagResponse {
  id: string;
  name: string;
  description: string;
  threadCount: number;
  followerCount: number;
  isSubscribed: boolean;
}

export interface ThreadSummaryResponse {
  id: string;
  authorId: string;
  authorName: string;
  authorSpecialization: string;
  title: string;
  contentPreview: string;
  tags: string[];
  type: string;
  viewCount: number;
  replyCount: number;
  upvoteCount: number;
  isClosed: boolean;
  isAnonymous: boolean;
  createdAt: string;
  lastRepliedAt?: string;
  isBookmarked: boolean;
  userVote: number;
}

export interface ForumStatsResponse {
  totalThreads: number;
  totalReplies: number;
  totalDoctors: number;
  activeThisWeek: number;
  popularTags: TagResponse[];
  trendingThreads: ThreadSummaryResponse[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
