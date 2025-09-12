// Article response from API
export interface ArticleResponseDTO {
  id: string;
  doctor: UserResponseDto;
  title: string;
  content: string;
  posterUrl: string;
  imageUrl: string;
  category: string;
  tags: string[];
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// User response from API
export interface UserResponseDto {
  firstName: string;
  lastName: string;
  imageUrl: string;
}

// Request DTO for creating an article
export interface ArticleRequestDTO {
  title: string;
  content: string;
  posterUrl?: string;
  imageUrl?: string;
  category: string;
  tags?: string[];
}

// Request DTO for updating an article
export interface ArticleUpdateRequestDto {
  title?: string;
  content?: string;
  posterUrl?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
}

// Request DTO for adding a comment
export interface ArticleCommentRequestDTO {
  articleId: string;
  comment: string;
}

// Response DTO for a comment
export interface ArticleCommentResponseDTO {
  id: string;
  userResponseDto: UserResponseDto;
  comment: string;
  createdAt: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Article Management Types
export interface Doctor {
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export interface Article {
  id: string;
  doctor: Doctor;
  title: string;
  content: string;
  posterUrl: string;
  imageUrl: string;
  category: string;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  data: Article[];
  error: string | null;
  success: boolean;
  timeStamp: string;
}

export interface ArticleDetailResponse {
  data: Article;
  error: string | null;
  success: boolean;
  timeStamp: string;
}

export interface UserResponseDto {
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userResponseDto: UserResponseDto;
  userType: "patient" | "doctor";
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  data: Comment[];
  error: string | null;
  success: boolean;
  timeStamp: string;
}

export interface LikesCountResponse {
  data: number;
  error: string | null;
  success: boolean;
  timeStamp: string;
}
