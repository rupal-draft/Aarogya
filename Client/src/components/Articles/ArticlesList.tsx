import React from "react";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Calendar, Filter } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "../../types/article";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter2";

interface ArticlesListProps {
  articles: Article[];
  onArticleClick: (articleId: string) => void;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  articles,
  onArticleClick,
}) => {
  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const categories = [...new Set(articles.map((article) => article.category))];
  const recentArticles = articles.filter((article) => {
    const articleDate = new Date(article.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return articleDate > weekAgo;
  }).length;

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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-500" />
                My Articles
              </h1>
              <p className="text-gray-600">
                Manage and track your published medical articles
              </p>
            </div>
            <motion.button
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-5 h-5" />
              Filter Articles
            </motion.button>
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
                    <AnimatedCounter value={categories.length} />
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
          {articles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              index={index}
              onArticleClick={onArticleClick}
            />
          ))}
        </div>

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
    </div>
  );
};
