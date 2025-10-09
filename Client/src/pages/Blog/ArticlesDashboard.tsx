// Updated ArticlesDashboard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useArticles } from "../../hooks/Articles/useArticles";
import { useArticleDetail } from "../../hooks/Articles/useArticleDetail";
import { ArticleDetail } from "../../components/Articles/ArticleDetail";
import { ArticlesList } from "../../components/Articles/ArticlesList";

import type {
  ArticleRequestDTO,
  ArticleUpdateRequestDto,
} from "../../types/article";
import {
  createArticle,
  deleteArticle,
  updateArticle,
} from "../../Services/articleService";

export const ArticlesDashboard: React.FC = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );

  const {
    data: articlesData,
    loading: articlesLoading,
    error: articlesError,
    refetch: refetchArticles,
  } = useArticles();

  const {
    article,
    comments,
    likesCount,
    loading: detailLoading,
    error: detailError,
  } = useArticleDetail(selectedArticleId || "");

  const handleArticleClick = (articleId: string) => {
    setSelectedArticleId(articleId);
  };

  const handleBackToList = () => {
    setSelectedArticleId(null);
  };

  const handleRefresh = async () => await refetchArticles();

  const handleCreateArticle = async (articleData: ArticleRequestDTO) => {
    await createArticle(articleData);
  };

  const handleUpdateArticle = async (
    id: string,
    articleData: ArticleUpdateRequestDto
  ) => {
    await updateArticle(id, articleData);
  };

  const handleDeleteArticle = async (id: string) => {
    await deleteArticle(id);
  };

  // Loading state
  if (articlesLoading || (selectedArticleId && detailLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-blue-500" />
          </motion.div>
          <p className="text-lg text-gray-600">
            {selectedArticleId
              ? "Loading article details..."
              : "Loading articles..."}
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (articlesError || (selectedArticleId && detailError)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to Load Data
          </h2>
          <p className="text-gray-600 mb-4">
            {articlesError || "Something went wrong while fetching data."}
          </p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Show article detail view
  if (selectedArticleId && article && comments && likesCount !== null) {
    return (
      <ArticleDetail
        article={article.data}
        comments={comments.data}
        likesCount={likesCount.data}
        onBack={handleBackToList}
      />
    );
  }

  // Show articles list with CRUD functionality
  if (articlesData && articlesData.data) {
    return (
      <ArticlesList
        articles={articlesData.data}
        onArticleClick={handleArticleClick}
        onArticleCreate={handleCreateArticle}
        onArticleUpdate={handleUpdateArticle}
        onArticleDelete={handleDeleteArticle}
        onRefresh={handleRefresh}
      />
    );
  }

  return null;
};
