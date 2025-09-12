import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type {
  ArticleDetailResponse,
  CommentsResponse,
  LikesCountResponse,
} from "../../types/article";

export const useArticleDetail = (articleId: string) => {
  const [article, setArticle] = useState<ArticleDetailResponse | null>(null);
  const [comments, setComments] = useState<CommentsResponse | null>(null);
  const [likesCount, setLikesCount] = useState<LikesCountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reusable fetch function
  const fetchArticleData = useCallback(async () => {
    try {
      setLoading(true);

      const [articleResponse, commentsResponse, likesResponse] =
        await Promise.all([
          axios.get(`http://localhost:8080/api/v1/article/core/${articleId}`, {
            withCredentials: true,
          }),
          axios.get(
            `http://localhost:8080/api/v1/article/core/${articleId}/comments`,
            { withCredentials: true }
          ),
          axios.get(
            `http://localhost:8080/api/v1/article/core/${articleId}/likes/count`,
            { withCredentials: true }
          ),
        ]);

      setArticle(articleResponse.data);
      setComments(commentsResponse.data);
      setLikesCount(likesResponse.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch article details");
      console.error("Error fetching article details:", err);
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    if (articleId) {
      fetchArticleData();
    }
  }, [articleId, fetchArticleData]);

  return {
    article,
    comments,
    likesCount,
    loading,
    error,
    refetch: fetchArticleData,
  };
};
