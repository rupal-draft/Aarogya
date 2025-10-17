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
  Clock,
  Bookmark,
  Star,
  ArrowRight,
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
          <motion.p
            key={index}
            className="mb-6 leading-relaxed text-gray-700 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            {paragraph.trim()}
          </motion.p>
        )
    );
  };

  const readingTime = Math.ceil(article.content.split(" ").length / 200);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-200/20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="container mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="group mb-8 flex items-center gap-3 text-blue-600 hover:text-blue-800 font-semibold bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg border border-white/20"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{
            x: -5,
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ x: [-2, 2, -2] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.div>
          Back to Articles
        </motion.button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Content - Left Side */}
          <motion.div
            className="lg:col-span-8 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Article Header */}
            <motion.div
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative overflow-hidden">
                <motion.img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-72 md:h-96 object-cover"
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category Tag */}
                <motion.div
                  className="absolute top-6 left-6"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span
                    className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 backdrop-blur-sm ${getCategoryColor(
                      article.category
                    )}`}
                  >
                    {article.category}
                  </span>
                </motion.div>

                <div className="absolute bottom-8 left-8 right-8">
                  <motion.h1
                    className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {article.title}
                  </motion.h1>

                  {/* Author Info */}
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                    >
                      <img
                        src={article.doctor.imageUrl}
                        alt={`${article.doctor.firstName} ${article.doctor.lastName}`}
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-white/30 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </motion.div>
                    <div className="text-white">
                      <h3 className="text-xl font-bold">
                        Dr. {article.doctor.firstName} {article.doctor.lastName}
                      </h3>
                      <p className="text-blue-100 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Stats Bar */}
              <motion.div
                className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <motion.div
                      className="flex items-center gap-2 text-gray-700"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span className="font-bold">
                        <AnimatedCounter value={article.views} />
                      </span>
                      <span className="text-gray-500">Views</span>
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-2 text-gray-700"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="font-bold">
                        <AnimatedCounter value={likesCount} />
                      </span>
                      <span className="text-gray-500">Likes</span>
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-2 text-gray-700"
                      whileHover={{ scale: 1.05 }}
                    >
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      <span className="font-bold">
                        <AnimatedCounter value={comments.length} />
                      </span>
                      <span className="text-gray-500">Comments</span>
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-2 text-gray-700"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Clock className="w-5 h-5 text-purple-500" />
                      <span className="font-bold">{readingTime}</span>
                      <span className="text-gray-500">min read</span>
                    </motion.div>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart className="w-4 h-4" />
                      Like
                    </motion.button>

                    <motion.button
                      className="p-3 bg-white text-blue-600 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Bookmark className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      className="p-3 bg-white text-blue-600 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex flex-wrap gap-3">
                  {article.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-2xl text-sm font-medium border border-blue-200 shadow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.05 }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                      }}
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Article Content */}
            <motion.div
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.div
                className="prose prose-lg max-w-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {formatContent(article.content)}
              </motion.div>

              {/* Updated Time */}
              <motion.div
                className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last updated:{" "}
                  {new Date(article.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(article.updatedAt).toLocaleTimeString()}
                </p>

                <motion.button
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                  whileHover={{ gap: 3 }}
                >
                  Share Article
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Sidebar - Right Side */}
          <motion.div
            className="lg:col-span-4 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Comments Section - Moved to Right Column */}
            <motion.div
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="p-2 bg-blue-100 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                Community Discussion
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-xl ml-2">
                  {comments.length}
                </span>
              </motion.h2>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {comments.map((comment, index) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    index={index}
                  />
                ))}
              </div>

              {comments.length === 0 && (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    No comments yet
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Be the first to share your thoughts!
                  </p>
                  <motion.button
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add First Comment
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
