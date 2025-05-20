import axios from "axios"
import type { ArticleCommentRequestDTO, ArticleCommentResponseDTO, ArticleResponseDTO } from "../types/article"
import { article } from "framer-motion/client"

// Base URL for API
const API_URL = "http://localhost:8080/api/v1/article/core"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

const extractData = (response: any) => {
  if (response.data && response.data.data !== undefined) {
    return response.data.data
  }
  return response.data
}

// Fetch all articles
export const fetchAllArticles = async (): Promise<ArticleResponseDTO[]> => {
  try {
    const response = await api.get("")
    return extractData(response)
  } catch (error) {
    console.error("Error fetching all articles:", error)
    throw error
  }
}

// Fetch article by ID
export const fetchArticleById = async (id: string): Promise<ArticleResponseDTO> => {
  try {
    const response = await api.get(`/${id}`)
    return extractData(response)
  } catch (error) {
    console.error(`Error fetching article with ID ${id}:`, error)
    throw error
  }
}

// Fetch articles by category
export const fetchArticlesByCategory = async (category: string): Promise<ArticleResponseDTO[]> => {
  try {
    const response = await api.get(`/category?category=${category}`)
    return extractData(response)
  } catch (error) {
    console.error(`Error fetching articles for category ${category}:`, error)
    throw error
  }
}

// Fetch recent articles
export const fetchRecentArticles = async (): Promise<ArticleResponseDTO[]> => {
  try {
    const response = await api.get("/recent")
    return extractData(response)
  } catch (error) {
    console.error("Error fetching recent articles:", error)
    throw error
  }
}

// Fetch popular articles
export const fetchPopularArticles = async (): Promise<ArticleResponseDTO[]> => {
  try {
    const response = await api.get("/popular")
    return extractData(response)
  } catch (error) {
    console.error("Error fetching popular articles:", error)
    throw error
  }
}

// Search articles
export const searchArticles = async (keyword: string): Promise<ArticleResponseDTO[]> => {
  try {
    const response = await api.get(`/search?keyword=${keyword}`)
    return extractData(response)
  } catch (error) {
    console.error(`Error searching articles with keyword ${keyword}:`, error)
    throw error
  }
}

// Like an article
export const likeArticle = async (id: string): Promise<void> => {
  try {
    await api.post(`/${id}/like`)
  } catch (error) {
    console.error(`Error liking article with ID ${id}:`, error)
    throw error
  }
}

// Unlike an article
export const unlikeArticle = async (id: string): Promise<void> => {
  try {
    await api.delete(`/${id}/unlike`)
  } catch (error) {
    console.error(`Error unliking article with ID ${id}:`, error)
    throw error
  }
}

// Add a comment to an article
export const commentArticle = async (comment: ArticleCommentRequestDTO): Promise<void> => {
  try {
    await api.post(`/comment`, comment)
  } catch (error) {
    console.error(`Error commenting on article with ID ${comment.articleId}:`, error)
    throw error
  }
}

// Get comments for an article
export const getArticleComments = async (id: string): Promise<ArticleCommentResponseDTO[]> => {
  try {
    const response = await api.get(`/${id}/comments`)
    return extractData(response)
  } catch (error) {
    console.error(`Error fetching comments for article with ID ${id}:`, error)
    throw error
  }
}

// Check if user has liked an article
export const hasLikedArticle = async (id: string): Promise<boolean> => {
  try {
    const response = await api.get(`/${id}/isLiked`)
    return extractData(response)
  } catch (error) {
    console.error(`Error checking if user  liked article ${id}:`, error)
    throw error
  }
}

export const getArticleLikesCount = async (id: string): Promise<number> => {
  try {
    const response = await api.get(`/${id}/likes/count`)
    return extractData(response)
  } catch (error) {
    console.error(`Error fetching like count for article with ID ${id}:`, error)
    throw error
  }
}
