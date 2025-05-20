"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { ArticleResponseDTO } from "../../types/article"
import { fetchAllArticles, fetchArticlesByCategory, fetchPopularArticles, fetchRecentArticles, searchArticles } from "../../Services/articleService"
import ErrorDisplay from "../../components/Error/ErrorDisplay"
import BlogBanner from "../../components/Articles/BlogBanner"
import BlogList from "../../components/Articles/BlogList"
import BlogSidebar from "../../components/Articles/BlogSidebar"


const BlogPage = () => {
  const [articles, setArticles] = useState<ArticleResponseDTO[]>([])
  const [recentArticles, setRecentArticles] = useState<ArticleResponseDTO[]>([])
  const [popularArticles, setPopularArticles] = useState<ArticleResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const articlesPerPage = 3

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch main articles
        const articlesData = await fetchAllArticles()
        setArticles(articlesData)

        // Fetch recent articles for sidebar
        const recentData = await fetchRecentArticles()
        setRecentArticles(recentData)

        // Fetch popular articles for sidebar
        const popularData = await fetchPopularArticles()
        setPopularArticles(popularData)
      } catch (err) {
        setError("Failed to load blog content. Please try again later.")
        console.error("Error fetching blog data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery) return

      setLoading(true)
      setError(null)

      try {
        const results = await searchArticles(searchQuery)
        setArticles(results)
        setCurrentPage(1)
      } catch (err) {
        setError("Search failed. Please try again.")
        console.error("Error searching articles:", err)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      if (searchQuery) {
        handleSearch()
      }
    }, 500)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  // Handle category selection
  const handleCategorySelect = async (category: string) => {
    setLoading(true)
    setError(null)
    setSelectedCategory(category)

    try {
      // This would normally call the category API, but for now we'll filter the existing articles
      // In a real implementation, you would call: const results = await fetchArticlesByCategory(category)
      const results = await fetchArticlesByCategory(category)
      setArticles(results)
      setCurrentPage(1)
    } catch (err) {
      setError("Failed to load category. Please try again.")
      console.error("Error fetching category:", err)
    } finally {
      setLoading(false)
    }
  }

  // Handle pagination
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil(articles.length / articlesPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Handle search input
  const handleSearchInput = (query: string) => {
    setSearchQuery(query)
  }

  // Reset filters
  const resetFilters = async () => {
    setLoading(true)
    setError(null)
    setSearchQuery("")
    setSelectedCategory(null)

    try {
      const articlesData = await fetchAllArticles()
      setArticles(articlesData)
      setCurrentPage(1)
    } catch (err) {
      setError("Failed to reset filters. Please try again.")
      console.error("Error resetting filters:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="blog-page">
      <BlogBanner />

      {error ? (
        <ErrorDisplay message={error} onRetry={resetFilters} />
      ) : (
        <motion.section
          className="blog-one blog-page-two py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-8/12">
                <BlogList
                  articles={currentArticles}
                  loading={loading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={paginate}
                />
              </div>

              <div className="lg:w-4/12">
                <BlogSidebar
                  onSearch={handleSearchInput}
                  searchQuery={searchQuery}
                  onCategorySelect={handleCategorySelect}
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

export default BlogPage
