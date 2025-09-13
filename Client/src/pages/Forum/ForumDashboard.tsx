import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { useForumStats } from "../../hooks/Forum/useForumStats";
import { useThreads } from "../../hooks/Forum/useThreads";
import { useThreadDetail } from "../../hooks/Forum/useThreadDetail";
import { useForumActions } from "../../hooks/Forum/useForumActions";
import { ThreadDetail } from "../../components/Forum/ThreadDetail";
import { ForumStats } from "../../components/Forum/ForumStats";
import { ThreadsList } from "../../components/Forum/ThreadsList";
import { useAuth } from "../../hooks/Redux/useAuth";

export const ForumDashboard: React.FC = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const { userId } = useAuth();

  // Hooks
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
  } = useForumStats();
  const {
    data: threads,
    loading: threadsLoading,
    error: threadsError,
    filter,
    updateFilter,
  } = useThreads();

  const {
    thread,
    replies,
    loading: threadDetailLoading,
    error: threadDetailError,
  } = useThreadDetail(selectedThreadId || "");

  const {
    voteThread,
    voteReply,
    bookmarkThread,
    removeBookmark,
    markAsSolution,
  } = useForumActions();

  // Handlers
  const handleThreadClick = (threadId: string) => {
    setSelectedThreadId(threadId);
  };

  const handleBackToList = () => {
    setSelectedThreadId(null);
  };

  const handleVoteThread = async (
    threadId: string,
    voteType: "UPVOTE" | "DOWNVOTE" | "NEUTRAL"
  ) => {
    try {
      await voteThread(threadId, { voteType });
      // Refresh data after voting
      // You might want to implement optimistic updates here
    } catch (error) {
      console.error("Failed to vote on thread:", error);
    }
  };

  const handleVoteReply = async (
    replyId: string,
    voteType: "UPVOTE" | "DOWNVOTE" | "NEUTRAL"
  ) => {
    try {
      await voteReply(replyId, { voteType });
      // Refresh data after voting
    } catch (error) {
      console.error("Failed to vote on reply:", error);
    }
  };

  const handleBookmark = async (threadId: string) => {
    try {
      // Check if already bookmarked
      const threadData = threads?.content.find((t) => t.id === threadId);
      if (threadData?.isBookmarked) {
        await removeBookmark(threadId);
      } else {
        await bookmarkThread(threadId);
      }
      // Refresh data after bookmarking
    } catch (error) {
      console.error("Failed to bookmark thread:", error);
    }
  };

  const handleMarkSolution = async (replyId: string) => {
    try {
      await markAsSolution(replyId);
      // Refresh data after marking solution
    } catch (error) {
      console.error("Failed to mark as solution:", error);
    }
  };

  const handleCreateThread = () => {
    // TODO: Implement create thread modal/form
    console.log("Create thread clicked");
  };

  const handleReply = (threadId: string, parentReplyId?: string) => {
    // TODO: Implement reply modal/form
    console.log("Reply clicked", { threadId, parentReplyId });
  };

  const handleEditThread = (threadId: string) => {
    // TODO: Implement edit thread modal/form
    console.log("Edit thread clicked", threadId);
  };

  const handleDeleteThread = (threadId: string) => {
    // TODO: Implement delete confirmation
    console.log("Delete thread clicked", threadId);
  };

  const handleEditReply = (replyId: string) => {
    // TODO: Implement edit reply modal/form
    console.log("Edit reply clicked", replyId);
  };

  const handleDeleteReply = (replyId: string) => {
    // TODO: Implement delete confirmation
    console.log("Delete reply clicked", replyId);
  };

  // Loading state
  if (
    statsLoading ||
    threadsLoading ||
    (selectedThreadId && threadDetailLoading)
  ) {
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
            {selectedThreadId
              ? "Loading thread details..."
              : "Loading forum..."}
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (statsError || threadsError || (selectedThreadId && threadDetailError)) {
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
            Unable to Load Forum
          </h2>
          <p className="text-gray-600 mb-4">
            {statsError ||
              threadsError ||
              threadDetailError ||
              "Something went wrong while fetching data."}
          </p>
          <p className="text-sm text-gray-500">
            Please ensure the API server is running on localhost:8080
          </p>
        </motion.div>
      </div>
    );
  }

  // Show thread detail view
  if (selectedThreadId && thread && replies) {
    return (
      <ThreadDetail
        thread={thread}
        replies={replies}
        onBack={handleBackToList}
        onVoteThread={handleVoteThread}
        onVoteReply={handleVoteReply}
        onBookmark={handleBookmark}
        onReply={handleReply}
        onMarkSolution={handleMarkSolution}
        onEditThread={handleEditThread}
        onDeleteThread={handleDeleteThread}
        onEditReply={handleEditReply}
        onDeleteReply={handleDeleteReply}
        currentUserId={userId}
      />
    );
  }

  // Show forum list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Forum Stats */}
        {stats && <ForumStats stats={stats} />}

        {/* Threads List */}
        {threads && (
          <ThreadsList
            threads={threads}
            filter={filter}
            onFilterChange={updateFilter}
            onThreadClick={handleThreadClick}
            onVote={handleVoteThread}
            onBookmark={handleBookmark}
            onCreateThread={handleCreateThread}
          />
        )}
      </motion.div>
    </div>
  );
};
