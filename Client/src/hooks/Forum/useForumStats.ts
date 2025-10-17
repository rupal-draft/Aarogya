import { useState, useEffect } from "react";
import axios from "axios";
import type { ForumStatsResponse } from "../../types/forum";

export const useForumStats = () => {
  const [data, setData] = useState<ForumStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/v1/doctors/forum/stats",
        {
          withCredentials: true,
        }
      );
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch forum statistics");
      console.error("Error fetching forum stats:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);

  return { data, loading, error, refetch: fetchStats };
};
