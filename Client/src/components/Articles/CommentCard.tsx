import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Comment } from "../../types/article";

interface CommentCardProps {
  comment: Comment;
  index: number;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment, index }) => {
  const getUserTypeColor = (userType: string) => {
    return userType === "doctor"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  const getUserTypeIcon = (userType: string) => {
    return userType === "doctor" ? "👨‍⚕️" : "👤";
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start gap-3">
        <motion.img
          src={comment.userResponseDto.imageUrl}
          alt={`${comment.userResponseDto.firstName} ${comment.userResponseDto.lastName}`}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-gray-900">
              {comment.userResponseDto.firstName}{" "}
              {comment.userResponseDto.lastName}
            </h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getUserTypeColor(
                comment.userType
              )}`}
            >
              {getUserTypeIcon(comment.userType)} {comment.userType}
            </span>
          </div>

          <p className="text-gray-700 mb-3 leading-relaxed">
            {comment.comment}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(comment.createdAt).toLocaleDateString()} at{" "}
              {new Date(comment.createdAt).toLocaleTimeString()}
            </span>
            {comment.createdAt !== comment.updatedAt && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
