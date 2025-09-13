import { useState } from "react";
import axios from "axios";
import type {
  CreateThreadRequest,
  CreateReplyRequest,
  VoteRequest,
  UpdateThreadRequest,
} from "../../types/forum";

export const useForumActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createThread = async (request: CreateThreadRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        "http://localhost:8080/api/v1/doctors/forum/threads",
        request,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      setError("Failed to create thread");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateThread = async (
    threadId: string,
    request: UpdateThreadRequest
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.patch(
        `http://localhost:8080/api/v1/doctors/forum/threads/${threadId}`,
        request,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      setError("Failed to update thread");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteThread = async (threadId: string) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(
        `http://localhost:8080/api/v1/doctors/forum/threads/${threadId}`,
        { withCredentials: true }
      );
    } catch (err) {
      setError("Failed to delete thread");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createReply = async (threadId: string, request: CreateReplyRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `http://localhost:8080/api/v1/doctors/forum/threads/${threadId}/replies`,
        request,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      setError("Failed to create reply");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReply = async (replyId: string, request: CreateReplyRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.patch(
        `http://localhost:8080/api/v1/doctors/forum/replies/${replyId}`,
        request,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      setError("Failed to update reply");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReply = async (replyId: string) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(
        `http://localhost:8080/api/v1/doctors/forum/replies/${replyId}`,
        { withCredentials: true }
      );
    } catch (err) {
      setError("Failed to delete reply");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const voteThread = async (threadId: string, request: VoteRequest) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/doctors/forum/threads/${threadId}/vote`,
        request,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      console.error("Failed to vote on thread:", err);
      throw err;
    }
  };

  const voteReply = async (replyId: string, request: VoteRequest) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/doctors/forum/replies/${replyId}/vote`,
        request,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      console.error("Failed to vote on reply:", err);
      throw err;
    }
  };

  const bookmarkThread = async (threadId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/doctors/forum/threads/${threadId}/bookmark`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      console.error("Failed to bookmark thread:", err);
      throw err;
    }
  };

  const removeBookmark = async (threadId: string) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/doctors/forum/threads/${threadId}/bookmark`,
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
      throw err;
    }
  };

  const markAsSolution = async (replyId: string) => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/doctors/forum/replies/${replyId}/solution`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to mark as solution:", err);
      throw err;
    }
  };

  return {
    loading,
    error,
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
  };
};
