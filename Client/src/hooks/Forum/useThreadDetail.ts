import { useState, useEffect } from "react";
import axios from "axios";
import type {
  ThreadResponse,
  ReplyResponse,
  PageResponse,
} from "../../types/forum";

export const useThreadDetail = (threadId: string) => {
  const [thread, setThread] = useState<ThreadResponse | null>(null);
  const [replies, setReplies] = useState<PageResponse<ReplyResponse> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreadDetail = async () => {
      if (!threadId) return;

      try {
        setLoading(true);

        const [threadResponse, repliesResponse] = await Promise.all([
          axios.get(
            `http://localhost:8080/api/v1/doctors/forum/threads/${threadId}`,
            {
              withCredentials: true,
            }
          ),
          axios.get(
            `http://localhost:8080/api/v1/doctors/forum/threads/${threadId}/replies`,
            {
              withCredentials: true,
            }
          ),
        ]);

        setThread(threadResponse.data);
        setReplies(repliesResponse.data);
        setError(null);

        // Record thread view
        await axios.post(
          `http://localhost:8080/api/v1/doctors/forum/threads/${threadId}/view`,
          {},
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        setError("Failed to fetch thread details");
        console.error("Error fetching thread details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreadDetail();
  }, [threadId]);

  return { thread, replies, loading, error };
};
