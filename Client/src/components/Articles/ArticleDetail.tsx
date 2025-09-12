import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Tag,
  Share2,
} from "lucide-react";
import { CommentCard } from "./CommentCard";
import type { Article, Comment } from "../../types/article";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter2";

interface ArticleDetailProps {
  article: Article;
  comments: Comment[];
  likesCount: number;
  onBack: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  comments,
  likesCount,
  onBack,
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      "Health Awareness": "bg-blue-100 text-blue-800 border-blue-200",
      Diabetes: "bg-red-100 text-red-800 border-red-200",
      "Mental Health": "bg-purple-100 text-purple-800 border-purple-200",
      Nutrition: "bg-green-100 text-green-800 border-green-200",
      Fitness: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const formatContent = (content: string) => {
    return content.split("\n").map(
      (paragraph, index) =>
        paragraph.trim() && (
          <p key={index} className="mb-4 leading-relaxed text-gray-700">
            {paragraph.trim()}
          </p>
        )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Articles
        </motion.button>

        {/* Article Header */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <motion.img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 md:h-80 object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                    article.category
                  )}`}
                >
                  {article.category}
                </span>
              </motion.div>
              <motion.h1
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {article.title}
              </motion.h1>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Author and Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <img
                  src={article.doctor.imageUrl}
                  alt={`${article.doctor.firstName} ${article.doctor.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Dr. {article.doctor.firstName} {article.doctor.lastName}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Published on{" "}
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <motion.div
                  className="flex items-center gap-2 text-gray-600"
                  whileHover={{ scale: 1.05 }}
                >
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">
                    <AnimatedCounter value={article.views} />
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 text-gray-600"
                  whileHover={{ scale: 1.05 }}
                >
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-semibold">
                    <AnimatedCounter value={likesCount} />
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 text-gray-600"
                  whileHover={{ scale: 1.05 }}
                >
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">
                    <AnimatedCounter value={comments.length} />
                  </span>
                </motion.div>
                <motion.button
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="prose prose-lg max-w-none">
            {formatContent(article.content)}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: {new Date(article.updatedAt).toLocaleDateString()}{" "}
              at {new Date(article.updatedAt).toLocaleTimeString()}
            </p>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            Comments
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2">
              {comments.length}
            </span>
          </h2>

          <div className="space-y-4">
            {comments.map((comment, index) => (
              <CommentCard key={comment.id} comment={comment} index={index} />
            ))}
          </div>

          {comments.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No comments yet</p>
              <p className="text-gray-400">
                Be the first to share your thoughts!
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
