"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  getArticleComments,
  commentArticle,
  likeArticle,
  unlikeArticle,
  getArticleLikesCount,
  hasLikedArticle,
  fetchRecentArticles,
  fetchPopularArticles,
  fetchArticleById,
} from "./../../Services/articleService"
import type { ArticleResponseDTO, ArticleCommentResponseDTO, ArticleCommentRequestDTO } from "../../types/article"
import BlogDetailBanner from "../../components/Articles/BlogDetailBanner"
import ErrorDisplay from "../../components/Error/ErrorDisplay"
import BlogDetailSkeleton from "../../components/Articles/BlogDetailSkeleton"
import ShareSection from "../../components/Articles/ShareSection"
import CommentSection from "../../components/Articles/CommentSection"
import CommentForm from "../../components/Articles/CommentForm"
import BlogSidebar from "../../components/Articles/BlogSidebar"


const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<ArticleResponseDTO | null>(null)
  const [comments, setComments] = useState<ArticleCommentResponseDTO[]>([])
  const [recentArticles, setRecentArticles] = useState<ArticleResponseDTO[]>([])
  const [popularArticles, setPopularArticles] = useState<ArticleResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Fetch article data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        // Fetch article details
        const articleData = await fetchArticleById(id)
        setArticle(articleData)

        // Fetch comments
        const commentsData = await getArticleComments(id)
        setComments(commentsData)

        // Fetch like count
        const likesCount = await getArticleLikesCount(id)
        setLikeCount(likesCount)

        // Check if user has liked the article
        // In a real app, you'd get the userId from auth context
        const liked = await hasLikedArticle(id)
        setIsLiked(liked)

        // Fetch sidebar data
        const recentData = await fetchRecentArticles()
        setRecentArticles(recentData)

        const popularData = await fetchPopularArticles()
        setPopularArticles(popularData)
      } catch (err) {
        setError("Failed to load article. Please try again later.")
        console.error("Error fetching article data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Handle like/unlike
  const handleLikeToggle = async () => {
    if (!id) return

    try {
      if (isLiked) {
        await unlikeArticle(id)
        setLikeCount((prev) => Math.max(0, prev - 1))
      } else {
        await likeArticle(id)
        setLikeCount((prev) => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (err) {
      console.error("Error toggling like:", err)
    }
  }

  // Handle comment submission
  const handleCommentSubmit = async (commentData: {
    message: string
  }) => {
    if (!id) return

    setCommentLoading(true)
    try {
      const newComment: ArticleCommentRequestDTO = {
        articleId: id,
        comment: commentData.message,
      }

      await commentArticle(newComment)

      // Refresh comments
      const updatedComments = await getArticleComments(id)
      setComments(updatedComments)
    } catch (err) {
      console.error("Error submitting comment:", err)
    } finally {
      setCommentLoading(false)
    }
  }

  // Handle navigation between posts
  const navigateToPrevPost = () => {
    // In a real app, you'd fetch the previous post ID from an API
    // For now, we'll just navigate back to the blog list
    navigate("/blogs")
  }

  const navigateToNextPost = () => {
    // In a real app, you'd fetch the next post ID from an API
    // For now, we'll just navigate back to the blog list
    navigate("/blogs")
  }



  return (
    <div className="blog-detail-page bg-gray-50">
      <BlogDetailBanner title={article?.title || "Blog Details"} />

      {error ? (
        <ErrorDisplay message={error} onRetry={() => navigate("/blogs")} />
      ) : (
        <motion.section
          className="py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-8/12">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <BlogDetailSkeleton />
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      {/* Article Content */}
                      <div className="p-6 md:p-8">
                        <motion.h1
                          className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          {article?.title}
                        </motion.h1>

                        {/* Author and Date */}
                        <motion.div
                          className="flex items-center mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          {article?.doctor && (
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 mr-3">
                                <img
                                  src={article.doctor.imageUrl || "/placeholder.svg?height=100&width=100"}
                                  alt={`${article.doctor.firstName} ${article.doctor.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800">
                                  Dr. {article.doctor.firstName} {article.doctor.lastName}
                                </h3>
                                <div className="flex items-center text-gray-500 text-sm">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>

                        {/* Featured Image */}
                        <motion.div
                          className="mb-8 rounded-lg overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <img
                            src={article?.imageUrl || "/placeholder.svg?height=600&width=1200"}
                            alt={article?.title}
                            className="w-full h-auto object-cover"
                          />
                        </motion.div>

                        {/* Article Content */}
                        <motion.div
                          className="prose prose-lg max-w-none"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          dangerouslySetInnerHTML={{ __html: article?.content || "" }}
                        />

                        {/* Tags */}
                        {article?.tags && article.tags.length > 0 && (
                          <motion.div
                            className="flex flex-wrap gap-2 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                          >
                            {article.tags.map((tag, index) => (
                              <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                                #{tag}
                              </span>
                            ))}
                          </motion.div>
                        )}

                        {/* Navigation */}
                        <motion.div
                          className="flex justify-between mt-10 pt-6 border-t border-gray-200"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                        >
                          <motion.button
                            onClick={navigateToPrevPost}
                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                            whileHover={{ x: -5 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous Post
                          </motion.button>
                          <motion.button
                            onClick={navigateToNextPost}
                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            Next Post
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.button>
                        </motion.div>

                        {/* Share Section */}
                        <ShareSection
                          articleTitle={article?.title || ""}
                          likeCount={likeCount}
                          isLiked={isLiked}
                          onLikeToggle={handleLikeToggle}
                        />
                      </div>

                      {/* Comments Section */}
                      <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-100">
                        <CommentSection comments={comments} />
                        <CommentForm onSubmit={handleCommentSubmit} isLoading={commentLoading} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="lg:w-4/12">
                <BlogSidebar
                  onSearch={undefined}
                  searchQuery={searchQuery}
                  onCategorySelect={undefined}
                  selectedCategory={selectedCategory}
                  recentArticles={recentArticles}
                  popularArticles={popularArticles}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  )
}

export default BlogDetailPage
