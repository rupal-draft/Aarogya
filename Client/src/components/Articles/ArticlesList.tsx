// components/Articles/ArticlesList.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Calendar,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "../../types/article";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter2";
import { CreateArticleModal } from "./CreateArticleModal";
import { UpdateArticleModal } from "./UpdateArticleModal";

interface ArticlesListProps {
  articles: Article[];
  onArticleClick: (articleId: string) => void;
  onArticleCreate: (articleData: any) => Promise<void>;
  onArticleUpdate: (id: string, articleData: any) => Promise<void>;
  onArticleDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  articles,
  onArticleClick,
  onArticleCreate,
  onArticleUpdate,
  onArticleDelete,
  onRefresh,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const categories = [
    "all",
    ...new Set(articles.map((article) => article.category)),
  ];
  const recentArticles = articles.filter((article) => {
    const articleDate = new Date(article.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return articleDate > weekAgo;
  }).length;

  // Filter and sort articles
  const filteredArticles = articles
    .filter(
      (article) =>
        (filterCategory === "all" || article.category === filterCategory) &&
        (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "views":
          return b.views - a.views;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setShowUpdateModal(true);
  };

  const handleDelete = async (article: Article) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${article.title}"? This action cannot be undone.`
      )
    ) {
      try {
        await onArticleDelete(article.id);
        onRefresh();
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const handleCreate = async (articleData: any) => {
    await onArticleCreate(articleData);
    onRefresh();
    setShowCreateModal(false);
  };

  const handleUpdate = async (id: string, articleData: any) => {
    await onArticleUpdate(id, articleData);
    onRefresh();
    setShowUpdateModal(false);
    setSelectedArticle(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-500" />
                My Articles
              </h1>
              <p className="text-gray-600">
                Manage and track your published medical articles
              </p>
            </div>

            {/* Create Article Button */}
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              New Article
            </motion.button>
          </div>

          {/* Search and Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="all">All Categories</option>
              {categories
                .filter((cat) => cat !== "all")
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Views</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              className="bg-blue-50 rounded-xl p-4 border border-blue-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={articles.length} />
                  </p>
                  <p className="text-sm text-gray-600">Total Articles</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-green-50 rounded-xl p-4 border border-green-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={totalViews} />
                  </p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-purple-50 rounded-xl p-4 border border-purple-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <Filter className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={categories.length - 1} />
                  </p>
                  <p className="text-sm text-gray-600">Categories</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-orange-50 rounded-xl p-4 border border-orange-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={recentArticles} />
                  </p>
                  <p className="text-sm text-gray-600">This Week</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              index={index}
              onArticleClick={onArticleClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery || filterCategory !== "all"
                  ? "No articles found"
                  : "No articles yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start sharing your medical knowledge with your first article"}
              </p>
              {!searchQuery && filterCategory === "all" && (
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Your First Article
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-2">
              Keep sharing valuable medical knowledge with your patients and
              colleagues
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Articles Synced</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">System Online</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <CreateArticleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />

      <UpdateArticleModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedArticle(null);
        }}
        onSubmit={handleUpdate}
        article={selectedArticle}
      />
    </div>
  );
};
