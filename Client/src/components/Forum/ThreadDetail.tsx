import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Eye,
  Bookmark,
  BookmarkCheck,
  Clock,
  Tag,
  User,
  Lock,
  MoreHorizontal,
  Edit,
  Trash2,
  Share2,
  Flag,
} from "lucide-react";
import type {
  ThreadResponse,
  ReplyResponse,
  PageResponse,
  CreateReplyRequest,
  UpdateThreadRequest,
} from "../../types/forum";
import { ReplyCard } from "./ReplyCard";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter2";
import { ReplyModal } from "../../components/Forum/ReplyModal";
import { EditThreadModal } from "../../components/Forum/EditThreadModal";
import { EditReplyModal } from "../../components/Forum/EditReplyModal";
import { ConfirmationModal } from "../../components/Forum/ConfirmationModal";

interface ThreadDetailProps {
  thread: ThreadResponse;
  replies: PageResponse<ReplyResponse>;
  onBack: () => void;
  onVoteThread: (
    threadId: string,
    voteType: "UPVOTE" | "DOWNVOTE" | "NEUTRAL"
  ) => void;
  onVoteReply: (
    replyId: string,
    voteType: "UPVOTE" | "DOWNVOTE" | "NEUTRAL"
  ) => void;
  onBookmark: (threadId: string) => void;
  onReply: (threadId: string, parentReplyId?: string) => void;
  onMarkSolution: (replyId: string) => void;
  onEditThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
  onEditReply: (replyId: string) => void;
  onDeleteReply: (replyId: string) => void;
  currentUserId?: string;
  // Modal handlers
  onReplySubmit: (data: CreateReplyRequest) => Promise<void>;
  onEditThreadSubmit: (data: UpdateThreadRequest) => Promise<void>;
  onEditReplySubmit: (data: CreateReplyRequest) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
  actionLoading: boolean;
  // Modal states
  showReply: boolean;
  setShowReply: (show: boolean) => void;
  showEditThread: boolean;
  setShowEditThread: (show: boolean) => void;
  showEditReply: boolean;
  setShowEditReply: (show: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  // Modal data
  replyData: {
    threadId: string;
    parentReplyId?: string;
    threadTitle?: string;
    parentReplyContent?: string;
  } | null;
  setReplyData: (data: any) => void;
  editingReplyId: string | null;
  setEditingReplyId: (id: string | null) => void;
  deleteData: {
    type: "thread" | "reply";
    id: string;
    title: string;
  } | null;
  setDeleteData: (data: any) => void;
}

export const ThreadDetail: React.FC<ThreadDetailProps> = ({
  thread,
  replies,
  onBack,
  onVoteThread,
  onVoteReply,
  onBookmark,
  onReply,
  onMarkSolution,
  onEditThread,
  onDeleteThread,
  onEditReply,
  onDeleteReply,
  currentUserId,
  onReplySubmit,
  onEditThreadSubmit,
  onEditReplySubmit,
  onDeleteConfirm,
  actionLoading,
  showReply,
  setShowReply,
  showEditThread,
  setShowEditThread,
  showEditReply,
  setShowEditReply,
  showDeleteConfirm,
  setShowDeleteConfirm,
  replyData,
  setReplyData,
  editingReplyId,
  setEditingReplyId,
  deleteData,
  setDeleteData,
}) => {
  const [showActions, setShowActions] = useState(false);
  const getTypeColor = (type: string) => {
    const colors = {
      QUESTION: "bg-blue-100 text-blue-800 border-blue-200",
      DISCUSSION: "bg-green-100 text-green-800 border-green-200",
      CASE_STUDY: "bg-purple-100 text-purple-800 border-purple-200",
      ANNOUNCEMENT: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "QUESTION":
        return "❓";
      case "DISCUSSION":
        return "💬";
      case "CASE_STUDY":
        return "📋";
      case "ANNOUNCEMENT":
        return "📢";
      default:
        return "📝";
    }
  };

  const handleVoteThread = (voteType: "UPVOTE" | "DOWNVOTE") => {
    let newVoteType: "UPVOTE" | "DOWNVOTE" | "NEUTRAL";

    if (voteType === "UPVOTE") {
      newVoteType = thread.userVote === 1 ? "NEUTRAL" : "UPVOTE";
    } else {
      newVoteType = thread.userVote === -1 ? "NEUTRAL" : "DOWNVOTE";
    }

    onVoteThread(thread.id, newVoteType);
  };

  const isAuthor = currentUserId === thread.authorId;
  const canMarkSolution = isAuthor && thread.type === "QUESTION";

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
          Back to Forum
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Vote Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
              <div className="flex lg:flex-col items-center lg:items-center gap-4 lg:gap-6">
                <motion.button
                  className={`p-3 rounded-full transition-colors ${
                    thread.userVote === 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                  }`}
                  onClick={() => handleVoteThread("UPVOTE")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowUp className="w-6 h-6" />
                </motion.button>

                <motion.div
                  className="text-2xl font-bold text-gray-900"
                  key={thread.upvoteCount}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatedCounter value={thread.upvoteCount} duration={0.5} />
                </motion.div>

                <motion.button
                  className={`p-3 rounded-full transition-colors ${
                    thread.userVote === -1
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600"
                  }`}
                  onClick={() => handleVoteThread("DOWNVOTE")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowDown className="w-6 h-6" />
                </motion.button>

                <div className="border-t lg:border-t-0 lg:border-l-0 pt-4 lg:pt-6 w-full lg:w-auto">
                  <div className="flex lg:flex-col items-center gap-4 lg:gap-3">
                    <motion.button
                      className={`p-2 rounded-full transition-colors ${
                        thread.isBookmarked
                          ? "text-yellow-500 hover:text-yellow-600"
                          : "text-gray-400 hover:text-yellow-500"
                      }`}
                      onClick={() => onBookmark(thread.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {thread.isBookmarked ? (
                        <BookmarkCheck className="w-6 h-6" />
                      ) : (
                        <Bookmark className="w-6 h-6" />
                      )}
                    </motion.button>

                    <motion.button
                      className="p-2 text-gray-400 hover:text-blue-500 rounded-full transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Thread Header */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(
                      thread.type
                    )}`}
                  >
                    {getTypeIcon(thread.type)} {thread.type.replace("_", " ")}
                  </span>
                  {thread.isClosed && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-200 flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      Closed
                    </span>
                  )}
                  {thread.isAnonymous && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      Anonymous
                    </span>
                  )}
                </div>

                <div className="relative">
                  <motion.button
                    onClick={() => setShowActions(!showActions)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    whileHover={{ scale: 1.1 }}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </motion.button>

                  {showActions && (
                    <motion.div
                      className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.1 }}
                    >
                      {isAuthor && (
                        <>
                          <button
                            onClick={() => {
                              onEditThread(thread.id);
                              setShowActions(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-blue-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onDeleteThread(thread.id);
                              setShowActions(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setShowActions(false)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Flag className="w-4 h-4" />
                        Report
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {thread.title}
              </h1>

              {/* Author and Stats */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">
                      {thread.isAnonymous ? "Anonymous" : thread.authorName}
                    </span>
                    {!thread.isAnonymous && thread.authorSpecialization && (
                      <span className="text-blue-600">
                        • {thread.authorSpecialization}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Eye className="w-4 h-4" />
                    <AnimatedCounter value={thread.viewCount} duration={0.5} />
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MessageSquare className="w-4 h-4" />
                    <AnimatedCounter value={thread.replyCount} duration={0.5} />
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Bookmark className="w-4 h-4" />
                    <AnimatedCounter
                      value={thread.bookmarkCount}
                      duration={0.5}
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {thread.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </motion.span>
                ))}
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {formatContent(thread.content)}
              </div>

              {/* Reply Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <motion.button
                  onClick={() => onReply(thread.id)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className="w-5 h-5" />
                  Reply to Thread
                </motion.button>
              </div>
            </motion.div>

            {/* Replies Section */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-500" />
                Replies
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2">
                  {replies.totalElements}
                </span>
              </h2>

              <div className="space-y-6">
                {replies.content.map((reply, index) => (
                  <ReplyCard
                    key={reply.id}
                    reply={reply}
                    index={index}
                    onVote={onVoteReply}
                    onReply={(parentReplyId) =>
                      onReply(thread.id, parentReplyId)
                    }
                    onMarkSolution={onMarkSolution}
                    onEdit={onEditReply}
                    onDelete={onDeleteReply}
                    canMarkSolution={canMarkSolution}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>

              {replies.content.length === 0 && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No replies yet</p>
                  <p className="text-gray-400 mb-6">
                    Be the first to share your thoughts!
                  </p>
                  <motion.button
                    onClick={() => onReply(thread.id)}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add First Reply
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <ReplyModal
        isOpen={showReply}
        onClose={() => {
          setShowReply(false);
          setReplyData(null);
        }}
        onSubmit={onReplySubmit}
        loading={actionLoading}
        threadTitle={replyData?.threadTitle}
        parentReplyId={replyData?.parentReplyId}
        parentReplyContent={replyData?.parentReplyContent}
      />

      <EditThreadModal
        isOpen={showEditThread}
        onClose={() => setShowEditThread(false)}
        onSubmit={onEditThreadSubmit}
        loading={actionLoading}
        thread={thread || undefined}
      />

      <EditReplyModal
        isOpen={showEditReply}
        onClose={() => {
          setShowEditReply(false);
          setEditingReplyId(null);
        }}
        onSubmit={onEditReplySubmit}
        loading={actionLoading}
        reply={
          replies?.content.find((r) => r.id === editingReplyId) ||
          replies?.content
            .flatMap((r) => r.childReplies || [])
            .find((r) => r.id === editingReplyId)
        }
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteData(null);
        }}
        onConfirm={onDeleteConfirm}
        loading={actionLoading}
        title={`Delete ${deleteData?.type || "item"}`}
        message={`Are you sure you want to delete ${deleteData?.title}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};
