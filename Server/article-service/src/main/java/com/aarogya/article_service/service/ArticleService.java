package com.aarogya.article_service.service;

import com.aarogya.article_service.dto.request.ArticleCommentRequestDTO;
import com.aarogya.article_service.dto.request.ArticleRequestDTO;
import com.aarogya.article_service.dto.request.ArticleUpdateRequestDto;
import com.aarogya.article_service.dto.response.ArticleCommentResponseDTO;
import com.aarogya.article_service.dto.response.ArticleResponseDTO;

import java.util.List;

public interface ArticleService {

    void postArticle(ArticleRequestDTO articleRequestDTO);

    List<ArticleResponseDTO> getAllArticles();

    ArticleResponseDTO getArticleById(String id);

    List<ArticleResponseDTO> getArticlesByCategory(String category);

    List<ArticleResponseDTO> getArticlesByTitle(String title);

    List<ArticleResponseDTO> getArticlesByAuthor(String authorId);

    List<ArticleResponseDTO> getMyArticles();

    List<ArticleResponseDTO> getRecentArticles();

    List<ArticleResponseDTO> getPopularArticles();

    List<ArticleResponseDTO> searchArticles(String keyword);

    void deleteArticle(String id);

    void updateArticle(String id, ArticleUpdateRequestDto articleUpdateRequestDto);

    void likeArticle(String articleId);

    void unlikeArticle(String articleId);

    int getLikesCount(String id);

    boolean hasLikedArticle(String id);

    void commentArticle(ArticleCommentRequestDTO articleCommentRequestDTO);

    List<ArticleCommentResponseDTO> getComments(String articleId);

    List<ArticleResponseDTO> getDoctorArticles();
}
