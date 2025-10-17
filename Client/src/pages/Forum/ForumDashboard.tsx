import React, { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useForumStats } from "../../hooks/Forum/useForumStats";
import { useThreads } from "../../hooks/Forum/useThreads";
import { useThreadDetail } from "../../hooks/Forum/useThreadDetail";
import { useForumActions } from "../../hooks/Forum/useForumActions";
import { ThreadDetail } from "../../components/Forum/ThreadDetail";
import { ForumStats } from "../../components/Forum/ForumStats";
import { ThreadsList } from "../../components/Forum/ThreadsList";
import { useAuth } from "../../hooks/Redux/useAuth";
import type {
  CreateReplyRequest,
  CreateThreadRequest,
  UpdateThreadRequest,
} from "../../types/forum";
import { CreateThreadModal } from "../../components/Forum/CreateThreadModal";

export const ForumDashboard: React.FC = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const { userId } = useAuth();

  // Modal states
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showEditThread, setShowEditThread] = useState(false);
  const [showEditReply, setShowEditReply] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Modal data
  const [replyData, setReplyData] = useState<{
    threadId: string;
    parentReplyId?: string;
    threadTitle?: string;
    parentReplyContent?: string;
  } | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [deleteData, setDeleteData] = useState<{
    type: "thread" | "reply";
    id: string;
    title: string;
  } | null>(null);

  // Hooks
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refreshThreadStats,
  } = useForumStats();
  const {
    data: threads,
    loading: threadsLoading,
    error: threadsError,
    filter,
    updateFilter,
    refetch: refreshThreadList,
  } = useThreads();

  const {
    thread,
    replies,
    loading: threadDetailLoading,
    error: threadDetailError,
    refetch: refreshThreadDetails,
  } = useThreadDetail(selectedThreadId || "");

  const {
    loading: actionLoading,
    createThread,
    updateThread,
    deleteThread,
    createReply,
    updateReply,
    deleteReply,
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
      await refreshThreadList();
      await refreshThreadDetails();
      await refreshThreadStats();
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
      await refreshThreadList();
      await refreshThreadDetails();
      await refreshThreadStats();
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
      await refreshThreadList();
      await refreshThreadDetails();
      await refreshThreadStats();
    } catch (error) {
      console.error("Failed to bookmark thread:", error);
    }
  };

  const handleMarkSolution = async (replyId: string) => {
    try {
      await markAsSolution(replyId);
      await refreshThreadList();
      await refreshThreadDetails();
      await refreshThreadStats();
    } catch (error) {
      console.error("Failed to mark as solution:", error);
    }
  };

  const handleCreateThread = () => {
    setShowCreateThread(true);
  };

  const handleReply = (threadId: string, parentReplyId?: string) => {
    const threadTitle =
      selectedThreadId && thread
        ? thread.title
        : threads?.content.find((t) => t.id === threadId)?.title;

    let parentReplyContent;
    if (parentReplyId && replies) {
      const findReply = (replies: any[]): any => {
        for (const reply of replies) {
          if (reply.id === parentReplyId) return reply;
          if (reply.childReplies) {
            const found = findReply(reply.childReplies);
            if (found) return found;
          }
        }
        return null;
      };
      const parentReply = findReply(replies.content);
      parentReplyContent = parentReply?.content;
    }

    setReplyData({
      threadId,
      parentReplyId,
      threadTitle,
      parentReplyContent,
    });
    setShowReply(true);
  };

  const handleEditThread = (threadId: string) => {
    setShowEditThread(true);
  };

  const handleDeleteThread = (threadId: string) => {
    const threadTitle =
      selectedThreadId && thread
        ? thread.title
        : threads?.content.find((t) => t.id === threadId)?.title ||
          "this thread";
    setDeleteData({
      type: "thread",
      id: threadId,
      title: threadTitle,
    });
    setShowDeleteConfirm(true);
  };

  const handleEditReply = (replyId: string) => {
    setEditingReplyId(replyId);
    setShowEditReply(true);
  };

  const handleDeleteReply = (replyId: string) => {
    setDeleteData({
      type: "reply",
      id: replyId,
      title: "this reply",
    });
    setShowDeleteConfirm(true);
  };

  // Modal handlers
  const handleCreateThreadSubmit = async (data: CreateThreadRequest) => {
    await createThread(data);
    await refreshThreadList();
    await refreshThreadDetails();
    await refreshThreadStats();
  };

  const handleReplySubmit = async (data: CreateReplyRequest) => {
    if (!replyData) return;
    await createReply(replyData.threadId, {
      ...data,
      parentReplyId: replyData.parentReplyId,
    });
    await refreshThreadDetails();
  };

  const handleEditThreadSubmit = async (data: UpdateThreadRequest) => {
    if (!selectedThreadId) return;
    await updateThread(selectedThreadId, data);
    await refreshThreadDetails();
    await refreshThreadStats();
  };

  const handleEditReplySubmit = async (data: CreateReplyRequest) => {
    if (!editingReplyId) return;
    await updateReply(editingReplyId, data);
    await refreshThreadDetails();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteData) return;

    if (deleteData.type === "thread") {
      await deleteThread(deleteData.id);
      if (selectedThreadId === deleteData.id) {
        setSelectedThreadId(null);
      }
    } else {
      await deleteReply(deleteData.id);
    }

    await refreshThreadList();
    await refreshThreadDetails();
    await refreshThreadStats();
  };

  // Loading state
  if (
    statsLoading ||
    threadsLoading ||
    (selectedThreadId && threadDetailLoading)
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <Loader2 className="w-12 h-12 text-blue-500" />
          </div>
          <p className="text-lg text-gray-600">
            {selectedThreadId
              ? "Loading thread details..."
              : "Loading forum..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (statsError || threadsError || (selectedThreadId && threadDetailError)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
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
        </div>
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
        // Modal handlers
        onReplySubmit={handleReplySubmit}
        onEditThreadSubmit={handleEditThreadSubmit}
        onEditReplySubmit={handleEditReplySubmit}
        onDeleteConfirm={handleDeleteConfirm}
        actionLoading={actionLoading}
        // Modal states
        showReply={showReply}
        setShowReply={setShowReply}
        showEditThread={showEditThread}
        setShowEditThread={setShowEditThread}
        showEditReply={showEditReply}
        setShowEditReply={setShowEditReply}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        // Modal data
        replyData={replyData}
        setReplyData={setReplyData}
        editingReplyId={editingReplyId}
        setEditingReplyId={setEditingReplyId}
        deleteData={deleteData}
        setDeleteData={setDeleteData}
      />
    );
  }

  // Show forum list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
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
      </div>

      {/* Modals */}
      <CreateThreadModal
        isOpen={showCreateThread}
        onClose={() => setShowCreateThread(false)}
        onSubmit={handleCreateThreadSubmit}
        loading={actionLoading}
      />
    </div>
  );
};
