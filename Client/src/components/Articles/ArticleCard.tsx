import React from "react";
import { motion } from "framer-motion";
import { Eye, Calendar, Tag, ArrowRight } from "lucide-react";
import type { Article } from "../../types/article";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter2";

interface ArticleCardProps {
  article: Article;
  index: number;
  onArticleClick: (articleId: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  index,
  onArticleClick,
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      "Health Awareness": "bg-blue-100 text-blue-800",
      Diabetes: "bg-red-100 text-red-800",
      "Mental Health": "bg-purple-100 text-purple-800",
      Nutrition: "bg-green-100 text-green-800",
      Fitness: "bg-orange-100 text-orange-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)",
        transition: { duration: 0.3 },
      }}
      onClick={() => onArticleClick(article.id)}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={article.posterUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRight className="w-5 h-5 text-blue-600" />
        </motion.div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
              article.category
            )}`}
          >
            {article.category}
          </span>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Eye className="w-4 h-4" />
            <AnimatedCounter value={article.views} duration={1} />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={article.doctor.imageUrl}
            alt={`${article.doctor.firstName} ${article.doctor.lastName}`}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
          />
          <div>
            <p className="font-medium text-gray-900">
              Dr. {article.doctor.firstName} {article.doctor.lastName}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(article.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag, tagIndex) => (
            <motion.span
              key={tagIndex}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + tagIndex * 0.05 }}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </motion.span>
          ))}
          {article.tags.length > 3 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              +{article.tags.length - 3} more
            </span>
          )}
        </div>

        <motion.div
          className="flex items-center justify-between pt-4 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm text-gray-500">
            Updated: {new Date(article.updatedAt).toLocaleDateString()}
          </span>
          <motion.div
            className="text-blue-600 font-medium text-sm flex items-center gap-1"
            whileHover={{ x: 5 }}
          >
            Read More
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
