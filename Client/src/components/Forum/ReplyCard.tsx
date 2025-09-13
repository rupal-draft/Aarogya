import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Reply,
} from "lucide-react";
import type { ReplyResponse } from "../../types/forum";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter2";

interface ReplyCardProps {
  reply: ReplyResponse;
  index: number;
  isNested?: boolean;
  onVote: (
    replyId: string,
    voteType: "UPVOTE" | "DOWNVOTE" | "NEUTRAL"
  ) => void;
  onReply: (parentReplyId: string) => void;
  onMarkSolution: (replyId: string) => void;
  onEdit: (replyId: string) => void;
  onDelete: (replyId: string) => void;
  canMarkSolution?: boolean;
  currentUserId?: string;
}

export const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  index,
  isNested = false,
  onVote,
  onReply,
  onMarkSolution,
  onEdit,
  onDelete,
  canMarkSolution = false,
  currentUserId,
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleVote = (voteType: "UPVOTE" | "DOWNVOTE") => {
    const newVoteType =
      reply.userVote === (voteType === "UPVOTE" ? 1 : -1)
        ? "NEUTRAL"
        : voteType;
    onVote(reply.id, newVoteType);
  };

  const isAuthor = currentUserId === reply.authorId;

  return (
    <motion.div
      className={`bg-white rounded-xl border border-gray-200 ${
        isNested ? "ml-8 mt-4" : ""
      } ${reply.isSolution ? "ring-2 ring-green-200 bg-green-50" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -1 }}
    >
      <div className="flex">
        {/* Vote Section */}
        <div className="flex flex-col items-center p-4 bg-gray-50 border-r border-gray-200">
          <motion.button
            className={`p-2 rounded-full transition-colors ${
              reply.userVote === 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
            }`}
            onClick={() => handleVote("UPVOTE")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>

          <motion.div
            className="text-lg font-bold text-gray-900 my-2"
            key={reply.upvoteCount}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatedCounter value={reply.upvoteCount} duration={0.5} />
          </motion.div>

          <motion.button
            className={`p-2 rounded-full transition-colors ${
              reply.userVote === -1
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600"
            }`}
            onClick={() => handleVote("DOWNVOTE")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">
                  {reply.isAnonymous ? "Anonymous" : reply.authorName}
                </span>
                {!reply.isAnonymous && reply.authorSpecialization && (
                  <span className="text-blue-600 text-sm">
                    • {reply.authorSpecialization}
                  </span>
                )}
              </div>

              {reply.isSolution && (
                <motion.div
                  className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <CheckCircle className="w-3 h-3" />
                  Solution
                </motion.div>
              )}
            </div>

            <div className="relative">
              <motion.button
                onClick={() => setShowActions(!showActions)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </motion.button>

              {showActions && (
                <motion.div
                  className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <button
                    onClick={() => {
                      onReply(reply.id);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>

                  {canMarkSolution && !reply.isSolution && (
                    <button
                      onClick={() => {
                        onMarkSolution(reply.id);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-green-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Solution
                    </button>
                  )}

                  {isAuthor && (
                    <>
                      <button
                        onClick={() => {
                          onEdit(reply.id);
                          setShowActions(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-blue-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDelete(reply.id);
                          setShowActions(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none mb-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {reply.content}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
              <span>at {new Date(reply.createdAt).toLocaleTimeString()}</span>
              {reply.createdAt !== reply.updatedAt && (
                <span className="text-gray-400">(edited)</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => onReply(reply.id)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                whileHover={{ scale: 1.05 }}
              >
                <MessageSquare className="w-4 h-4" />
                Reply
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Child Replies */}
      {reply.childReplies && reply.childReplies.length > 0 && (
        <div className="border-t border-gray-200">
          {reply.childReplies.map((childReply, childIndex) => (
            <ReplyCard
              key={childReply.id}
              reply={childReply}
              index={childIndex}
              isNested={true}
              onVote={onVote}
              onReply={onReply}
              onMarkSolution={onMarkSolution}
              onEdit={onEdit}
              onDelete={onDelete}
              canMarkSolution={canMarkSolution}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
