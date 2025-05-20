// Article response from API
export interface ArticleResponseDTO {
    id: string
    doctor: UserResponseDto
    title: string
    content: string
    posterUrl: string
    imageUrl: string
    category: string
    tags: string[]
    status: string
    views: number
    createdAt: string
    updatedAt: string
  }

  // User response from API
  export interface UserResponseDto {
    firstName: string
    lastName: string
    imageUrl: string
  }

  // Request DTO for creating an article
  export interface ArticleRequestDTO {
    title: string
    content: string
    posterUrl?: string
    imageUrl?: string
    category: string
    tags?: string[]
  }

  // Request DTO for updating an article
  export interface ArticleUpdateRequestDto {
    title?: string
    content?: string
    posterUrl?: string
    imageUrl?: string
    category?: string
    tags?: string[]
  }

  // Request DTO for adding a comment
  export interface ArticleCommentRequestDTO {
    articleId: string
    comment: string
  }

  // Response DTO for a comment
  export interface ArticleCommentResponseDTO {
    id: string
    userResponseDto: UserResponseDto
    comment: string
    createdAt: string
  }

  // API response wrapper
  export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
  }
