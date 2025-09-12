import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { ArticlesResponse } from "../../types/article";

export const useArticles = () => {
  const [data, setData] = useState<ArticlesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/v1/article/core/me",
        { withCredentials: true }
      );
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch articles");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { data, loading, error, refetch: fetchArticles };
};
