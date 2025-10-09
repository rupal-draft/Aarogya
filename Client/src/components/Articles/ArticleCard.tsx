// components/Articles/ArticleCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { Eye, Calendar, Tag, Edit3, Trash2, MoreVertical } from "lucide-react";
import type { Article } from "../../types/article";

interface ArticleCardProps {
  article: Article;
  index: number;
  onArticleClick: (articleId: string) => void;
  onEdit?: (article: Article) => void;
  onDelete?: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  index,
  onArticleClick,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
    >
      {/* Image */}
      <div
        className="relative h-48 overflow-hidden"
        onClick={() => onArticleClick(article.id)}
      >
        <img
          src={article.imageUrl || "/api/placeholder/400/200"}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
              article.category
            )}`}
          >
            {article.category}
          </span>
        </div>

        {/* Action Menu */}
        {(onEdit || onDelete) && (
          <div className="absolute top-4 right-4">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors backdrop-blur-sm"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(article);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Article
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(article);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Article
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6" onClick={() => onArticleClick(article.id)}>
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.content.substring(0, 120)}...
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {article.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
              +{article.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center">
            <img
              src={article.doctor.imageUrl}
              alt={`Dr. ${article.doctor.firstName} ${article.doctor.lastName}`}
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
