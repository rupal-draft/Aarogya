import { useState, useEffect } from "react";
import axios from "axios";
import type { TagResponse } from "../../types/forum";

export const useTags = () => {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8080/api/v1/doctors/forum/tags",
          {
            withCredentials: true,
          }
        );
        setTags(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch tags");
        console.error("Error fetching tags:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const subscribeToTag = async (tagName: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/doctors/forum/tags/${tagName}/subscribe`,
        {},
        { withCredentials: true }
      );

      setTags((prev) =>
        prev.map((tag) =>
          tag.name === tagName
            ? {
                ...tag,
                isSubscribed: true,
                followerCount: tag.followerCount + 1,
              }
            : tag
        )
      );

      return response.data;
    } catch (err) {
      console.error("Failed to subscribe to tag:", err);
      throw err;
    }
  };

  const unsubscribeFromTag = async (tagName: string) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/doctors/forum/tags/${tagName}/subscribe`,
        { withCredentials: true }
      );

      setTags((prev) =>
        prev.map((tag) =>
          tag.name === tagName
            ? {
                ...tag,
                isSubscribed: false,
                followerCount: Math.max(0, tag.followerCount - 1),
              }
            : tag
        )
      );
    } catch (err) {
      console.error("Failed to unsubscribe from tag:", err);
      throw err;
    }
  };

  return { tags, loading, error, subscribeToTag, unsubscribeFromTag };
};
