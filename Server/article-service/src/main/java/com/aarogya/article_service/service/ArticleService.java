package com.aarogya.article_service.service;

import com.aarogya.article_service.dto.*;

import java.util.List;

public interface ArticleService {

    void postArticle(ArticleRequestDTO articleRequestDTO);

    List<ArticleResponseDTO> getAllArticles();

    ArticleResponseDTO getArticleById(Long id);

    List<ArticleResponseDTO> getArticlesByCategory(String category);

    List<ArticleResponseDTO> getArticlesByTitle(String title);

    List<ArticleResponseDTO> getArticlesByAuthor(String authorId);

    List<ArticleResponseDTO> getMyArticles();

    List<ArticleResponseDTO> getRecentArticles();

    List<ArticleResponseDTO> getPopularArticles();

    void deleteArticle(String id);

    void updateArticle(String id, String title, String content);

    void likeArticle(String articleId);

    void unlikeArticle(String articleId);

    int getLikesCount(String id);

    boolean hasLikedArticle(String id, String userId);

    void commentArticle(ArticleCommentRequestDTO articleCommentRequestDTO);

    List<ArticleCommentResponseDTO> getComments(String articleId);
}
