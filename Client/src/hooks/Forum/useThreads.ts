import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type {
  ThreadSummaryResponse,
  ThreadFilterRequest,
  PageResponse,
} from "../../types/forum";

export const useThreads = (initialFilter: ThreadFilterRequest = {}) => {
  const [data, setData] = useState<PageResponse<ThreadSummaryResponse> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ThreadFilterRequest>(initialFilter);

  const fetchThreads = useCallback(
    async (currentFilter: ThreadFilterRequest = filter) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (currentFilter.tags?.length)
          params.append("tags", currentFilter.tags.join(","));
        if (currentFilter.type) params.append("type", currentFilter.type);
        if (currentFilter.status) params.append("status", currentFilter.status);
        if (currentFilter.authorId)
          params.append("authorId", currentFilter.authorId);
        if (currentFilter.bookmarked)
          params.append("bookmarked", currentFilter.bookmarked.toString());
        if (currentFilter.participated)
          params.append("participated", currentFilter.participated.toString());
        if (currentFilter.searchQuery)
          params.append("searchQuery", currentFilter.searchQuery);
        if (currentFilter.sortBy) params.append("sortBy", currentFilter.sortBy);
        if (currentFilter.sortOrder)
          params.append("sortOrder", currentFilter.sortOrder);

        params.append("page", (currentFilter.page || 0).toString());
        params.append("size", (currentFilter.size || 20).toString());

        const response = await axios.get(
          `http://localhost:8080/api/v1/doctors/forum/threads?${params.toString()}`,
          { withCredentials: true }
        );
        setData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch threads");
        console.error("Error fetching threads:", err);
      } finally {
        setLoading(false);
      }
    },
    [filter]
  );

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const updateFilter = (newFilter: Partial<ThreadFilterRequest>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    fetchThreads(updatedFilter);
  };

  return { data, loading, error, filter, updateFilter, refetch: fetchThreads };
};
