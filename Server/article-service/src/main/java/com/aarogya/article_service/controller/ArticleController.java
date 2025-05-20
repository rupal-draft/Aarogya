package com.aarogya.article_service.controller;

import com.aarogya.article_service.advices.ApiError;
import com.aarogya.article_service.advices.ApiResponse;
import com.aarogya.article_service.dto.*;
import com.aarogya.article_service.service.ArticleService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/core")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @PostMapping
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodPostArticle")
    public ResponseEntity<ApiResponse<String>> postArticle(@RequestBody ArticleRequestDTO articleRequestDTO) {
        articleService.postArticle(articleRequestDTO);
        return ResponseEntity.ok(ApiResponse.success("Article created successfully"));
    }

    @PutMapping("/{id}")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodUpdateArticle")
    public ResponseEntity<ApiResponse<String>> updateArticle(@PathVariable String id, @RequestBody ArticleUpdateRequestDto articleRequestDTO) {
        articleService.updateArticle(id, articleRequestDTO);
        return ResponseEntity.ok(ApiResponse.success("Article updated successfully"));
    }

    @DeleteMapping("/{id}")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodDeleteArticle")
    public ResponseEntity<ApiResponse<String>> deleteArticle(@PathVariable String id) {
        articleService.deleteArticle(id);
        return ResponseEntity.ok(ApiResponse.success("Article deleted successfully"));
    }

    @GetMapping
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodGetAllArticles")
    public ResponseEntity<ApiResponse<List<ArticleResponseDTO>>> getAllArticles() {
        return ResponseEntity.ok(ApiResponse.success(articleService.getAllArticles()));
    }

    @GetMapping("/{id}")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodGetArticle")
    public ResponseEntity<ApiResponse<ArticleResponseDTO>> getArticle(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(articleService.getArticleById(id)));
    }

    @GetMapping("/category")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodGetArticlesByCategory")
    public ResponseEntity<ApiResponse<List<ArticleResponseDTO>>> getArticlesByCategory(@RequestParam String category) {
        return ResponseEntity.ok(ApiResponse.success(articleService.getArticlesByCategory(category)));
    }

    @GetMapping("/author")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodGetArticlesByAuthor")
    public ResponseEntity<ApiResponse<List<ArticleResponseDTO>>> getArticlesByAuthor(@RequestParam String author) {
        return ResponseEntity.ok(ApiResponse.success(articleService.getArticlesByAuthor(author)));
    }

    @GetMapping("/title")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodGetArticlesByTitle")
    public ResponseEntity<ApiResponse<List<ArticleResponseDTO>>> getArticlesByTitle(@RequestParam String title) {
        return ResponseEntity.ok(ApiResponse.success(articleService.getArticlesByTitle(title)));
    }

    @GetMapping("/me")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodGetMyArticles")
    public ResponseEntity<ApiResponse<List<ArticleResponseDTO>>> getMyArticles() {
        return ResponseEntity.ok(ApiResponse.success(articleService.getMyArticles()));
    }

    @GetMapping("/recent")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodGetRecentArticles")
    public ResponseEntity<ApiResponse<List<ArticleResponseDTO>>> getRecentArticles() {
        return ResponseEntity.ok(ApiResponse.success(articleService.getRecentArticles()));
    }

    @GetMapping("/search")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodSearchArticles")
    public ResponseEntity<List<ArticleResponseDTO>> searchArticles(@RequestParam String keyword) {
        return ResponseEntity.ok(articleService.searchArticles(keyword));
    }

    @GetMapping("/popular")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodGetPopularArticles")
    public ResponseEntity<ApiResponse<List<ArticleResponseDTO>>> getPopularArticles() {
        return ResponseEntity.ok(ApiResponse.success(articleService.getPopularArticles()));
    }

    @PostMapping("/{id}/like")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodLikeArticle")
    public ResponseEntity<ApiResponse<String>> likeArticle(@PathVariable String id) {
        articleService.likeArticle(id);
        return ResponseEntity.ok(ApiResponse.success("Article liked successfully"));
    }

    @DeleteMapping("/{id}/unlike")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodUnLikeArticle")
    public ResponseEntity<ApiResponse<String>> unLikeArticle(@PathVariable String id) {
        articleService.unlikeArticle(id);
        return ResponseEntity.ok(ApiResponse.success("Article unliked successfully"));
    }

    @PostMapping("/{id}/comment")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodCommentArticle")
    public ResponseEntity<ApiResponse<String>> commentArticle(@PathVariable String id, @RequestBody ArticleCommentRequestDTO comment) {
        articleService.commentArticle(comment);
        return ResponseEntity.ok(ApiResponse.success("Article commented successfully"));
    }

    @GetMapping("/{id}/comments")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodGetComments")
    public ResponseEntity<ApiResponse<List<ArticleCommentResponseDTO>>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(articleService.getComments(id)));
    }

    @GetMapping("/{id}/likes/count")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodGetLikesCount")
    public ResponseEntity<ApiResponse<Integer>> getLikesCount(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(articleService.getLikesCount(id)));
    }

    @GetMapping("/{id}/isLiked")
    @RateLimiter(name = "article", fallbackMethod = "fallbackMethodIsLiked")
    public ResponseEntity<ApiResponse<Boolean>> isLiked(@PathVariable String id, @RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success(articleService.hasLikedArticle(id, userId)));
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallback(String serviceName, Throwable throwable) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests to " + serviceName + ". Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodPostArticle(ArticleRequestDTO articleRequestDTO) {
        return rateLimitFallback("postArticle", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodUpdateArticle(String id, ArticleUpdateRequestDto articleRequestDTO) {
        return rateLimitFallback("updateArticle", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodDeleteArticle(String id) {
        return rateLimitFallback("deleteArticle", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodGetAllArticles() {
        return rateLimitFallback("getAllArticles", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodGetArticle(String id) {
        return rateLimitFallback("getArticle", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodGetArticlesByCategory(String category) {
        return rateLimitFallback("getArticlesByCategory", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodGetArticlesByAuthor(String author) {
        return rateLimitFallback("getArticlesByAuthor", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodGetArticlesByTitle(String title) {
        return rateLimitFallback("getArticlesByTitle", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodGetMyArticles() {
        return rateLimitFallback("getMyArticles", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodGetRecentArticles() {
        return rateLimitFallback("getRecentArticles", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodSearchArticles(String keyword) {
        return rateLimitFallback("searchArticles", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodGetPopularArticles() {
        return rateLimitFallback("getPopularArticles", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodLikeArticle(String id) {
        return rateLimitFallback("likeArticle", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodUnLikeArticle(String id) {
        return rateLimitFallback("unlikeArticle", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodCommentArticle(String id, ArticleCommentRequestDTO comment) {
        return rateLimitFallback("commentArticle", null);
    }

    public ResponseEntity<ApiResponse<String>> fallbackMethodGetComments(String id) {
        return rateLimitFallback("getComments", null);
    }
}
