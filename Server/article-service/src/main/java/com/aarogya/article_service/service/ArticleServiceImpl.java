package com.aarogya.article_service.service;

import com.aarogya.article_service.auth.UserContext;
import com.aarogya.article_service.auth.UserContextHolder;
import com.aarogya.article_service.document.ArticleComments;
import com.aarogya.article_service.document.ArticleLikes;
import com.aarogya.article_service.document.Articles;
import com.aarogya.article_service.dto.*;
import com.aarogya.article_service.exceptions.*;
import com.aarogya.article_service.grpc.Clients.UserGrpcClient;
import com.aarogya.article_service.repository.ArticleRepository;
import com.aarogya.article_service.repository.CommentRepository;
import com.aarogya.article_service.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.modelmapper.MappingException;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArticleServiceImpl implements ArticleService{

    private final ArticleRepository articleRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final ModelMapper modelMapper;
    private final UserGrpcClient userGrpcClient;

    @Override
    @Transactional
    @CacheEvict(value = "articles", allEntries = true)
    public void postArticle(ArticleRequestDTO articleRequestDTO) {
        log.info("article request received {}", articleRequestDTO);
        String role = UserContextHolder.getUserDetails().getRole();
        if(!role.equalsIgnoreCase("DOCTOR")) {
            throw new AccessForbidden("Access Denied");
        }
        try {
            String userId = UserContextHolder
                    .getUserDetails()
                    .getUserId();

            Articles articles = modelMapper.map(articleRequestDTO, Articles.class);
            articles.setUserType(role);
            articles.setCreatedAt(LocalDateTime.now());
            articles.setUpdatedAt(LocalDateTime.now());
            articles.setDoctorId(userId);

            articleRepository.save(articles);
        } catch (DataAccessException e) {
            log.error("error while saving article {}", articleRequestDTO, e);
            throw new DataIntegrityViolation("Error while saving article");
        } catch (MappingException e) {
            log.error("error while mapping article {}", articleRequestDTO, e);
            throw new DataIntegrityViolation("Error while mapping article");
        } catch (Exception e) {
            log.error("error while saving article {}", articleRequestDTO, e);
            throw new RuntimeConflict("Error while saving article");
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "articles")
    public List<ArticleResponseDTO> getAllArticles() {
        return articleRepository.findAll()
                .stream()
                .map(this::mapToArticleResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ArticleResponseDTO getArticleById(Long id) {
        incrementArticleViews(id.toString());
        return getArticleByIdCached(id);
    }

    @Cacheable(value = "articles", key = "#id")
    @Transactional(readOnly = true)
    public ArticleResponseDTO getArticleByIdCached(Long id) {
        return articleRepository.findById(id.toString())
                .map(this::mapToArticleResponse)
                .orElseThrow(() -> new ResourceNotFound("Article not found with id: " + id));
    }

    @Transactional
    public void incrementArticleViews(String articleId) {
        articleRepository.findById(articleId).ifPresent(article -> {
            article.setViews(article.getViews() + 1);
            articleRepository.save(article);
        });
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "articles", key = "#category")
    public List<ArticleResponseDTO> getArticlesByCategory(String category) {
        return articleRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::mapToArticleResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "articles", key = "#title")
    public List<ArticleResponseDTO> getArticlesByTitle(String title) {
        return articleRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::mapToArticleResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "articles", key = "#authorId")
    public List<ArticleResponseDTO> getArticlesByAuthor(String authorId) {
        return articleRepository.findByDoctorId(authorId)
                .stream()
                .map(this::mapToArticleResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(
            value = "myArticles",
            key = "#root.methodName + '_' + T(com.aarogya.article_service.auth.UserContextHolder).getUserDetails().getUserId()"
    )
    public List<ArticleResponseDTO> getMyArticles() {
        return articleRepository.findByDoctorId(UserContextHolder.getUserDetails().getUserId())
                .stream()
                .map(this::mapToArticleResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "articles", key = "'recent'")
    public List<ArticleResponseDTO> getRecentArticles() {
        return articleRepository.findTop4ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToArticleResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "articles", key = "'popular'")
    public List<ArticleResponseDTO> getPopularArticles() {
        return articleRepository.findTop4ByOrderByViewsDesc()
                .stream()
                .map(this::mapToArticleResponse)
                .collect(Collectors.toList());
    }


    private ArticleResponseDTO mapToArticleResponse(Articles article) {
        try {
            DoctorResponseDTO doctor = userGrpcClient.getDoctor(article.getDoctorId());
            UserResponseDto userDto = modelMapper.map(doctor, UserResponseDto.class);

            ArticleResponseDTO dto = modelMapper.map(article, ArticleResponseDTO.class);
            dto.setDoctor(userDto);

            return dto;
        } catch (MappingException e) {
            log.error("error while mapping article {}", article, e);
            throw new DataIntegrityViolation("Error while mapping article");
        } catch (Exception e) {
            log.error("Failed to map article {} with doctorId {}", article.getId(), article.getDoctorId(), e);
            throw new DataIntegrityViolation("Error while mapping article with doctor data");
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = "articles", allEntries = true)
    public void deleteArticle(String id) {
        log.info("Article with id {} delete request", id);
        if (!"DOCTOR".equalsIgnoreCase(UserContextHolder.getUserDetails().getRole())) {
            throw new AccessForbidden("Access Denied");
        }
        try {
            Articles articles = articleRepository
                    .findById(id)
                    .orElseThrow(() -> new ResourceNotFound("Article not found with id " + id));
            articleRepository.delete(articles);
        } catch (DataAccessException e) {
            log.error("error while deleting article {}", id, e);
            throw new DataIntegrityViolation("Error while deleting article");
        } catch (Exception e) {
            log.error("error while deleting article {}", id, e);
            throw new RuntimeConflict("Error while deleting article");
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = "articles", allEntries = true)
    public void updateArticle(String id, String title, String content) {
        log.info("article with id {} update request", id);
        if (!"DOCTOR".equalsIgnoreCase(UserContextHolder.getUserDetails().getRole())) {
            throw new AccessForbidden("Access Denied");
        }
        try {
            Articles articles = articleRepository
                    .findById(id)
                    .orElseThrow(() -> new ResourceNotFound("Article not found with id " + id));

            if(title != null) {
                articles.setTitle(title);
            }
            if (content != null) {
                articles.setContent(content);
            }
            articles.setUpdatedAt(LocalDateTime.now());

            articleRepository.save(articles);
        } catch (DataAccessException e) {
            log.error("error while updating article {}", id, e);
            throw new DataIntegrityViolation("Error while updating article");
        } catch (Exception e) {
            log.error("error while updating article {}", id, e);
            throw new RuntimeConflict("Error while updating article");
        }
    }

    @Override
    @Transactional
    public void likeArticle(String articleId) {
        log.info("Article like request received with id: {}", articleId);
        try {
            String userId = UserContextHolder
                    .getUserDetails()
                    .getUserId();
            if(likeRepository.existsByArticleIdAndUserId(articleId, userId)) {
                throw new IllegalState("Article already liked");
            }
            ArticleLikes articleLikes = ArticleLikes
                    .builder()
                    .articleId(articleId)
                    .userId(userId)
                    .build();

            likeRepository.save(articleLikes);
        } catch (DataAccessException e) {
            log.error("error while liking article {}", articleId, e);
            throw new DataIntegrityViolation("Error while liking article");
        } catch (Exception e) {
            log.error("error while liking article {}", articleId, e);
            throw new RuntimeConflict("Error while liking article");
        }
    }

    @Override
    @Transactional
    public void unlikeArticle(String articleId) {
        log.info("Article unlike request received with id: {}", articleId);
        try {
            String userId = UserContextHolder
                    .getUserDetails()
                    .getUserId();
            if(!likeRepository.existsByArticleIdAndUserId(articleId, userId)) {
                throw new IllegalState("Article not liked");
            }
            likeRepository.deleteByArticleIdAndUserId(articleId, userId);
        } catch (DataAccessException e) {
            log.error("error while unliking article {}", articleId, e);
            throw new DataIntegrityViolation("Error while unliking article");
        } catch (Exception e) {
            log.error("error while unliking article {}", articleId, e);
            throw new RuntimeConflict("Error while unliking article");
        }
    }

    @Override
    public int getLikesCount(String id) {
        log.info("Article like count request received with id: {}", id);
        try {
            return likeRepository.countByArticleId(id);
        } catch (DataAccessException e) {
            log.error("error while getting like count for article {}", id, e);
        } catch (Exception e) {
            log.error("error while getting like count for article {}", id, e);
        }
        return 0;
    }

    @Override
    public boolean hasLikedArticle(String id, String userId) {
        log.info("Liked Article check request received with id: {}", id);
        try {
            return likeRepository.existsByArticleIdAndUserId(id, userId);
        } catch (DataAccessException e) {
            log.error("error while checking if user has liked article {}", id, e);
        } catch (Exception e) {
            log.error("error while checking if user has liked article {}", id, e);
        }
        return false;
    }

    @Override
    @Transactional
    public void commentArticle(ArticleCommentRequestDTO articleCommentRequestDTO) {
        log.info("Article comment request received {}", articleCommentRequestDTO);
        if (articleCommentRequestDTO.getComment() == null) {
            throw new IllegalState("Comment cannot be empty");
        }
        try {
            UserContext user = UserContextHolder
                    .getUserDetails();

            ArticleComments articleComments = ArticleComments
                    .builder()
                    .comment(articleCommentRequestDTO.getComment())
                    .articleId(articleCommentRequestDTO.getArticleId())
                    .userId(user.getUserId())
                    .userType(user.getRole())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            commentRepository.save(articleComments);
        } catch (DataAccessException e) {
            log.error("error while commenting article {}", articleCommentRequestDTO, e);
            throw new DataIntegrityViolation("Error while commenting article");
        } catch (Exception e) {
            log.error("error while commenting article {}", articleCommentRequestDTO, e);
            throw new RuntimeConflict("Error while commenting article");
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "comments", key = "#articleId")
    public List<ArticleCommentResponseDTO> getComments(String articleId) {
        log.info("Article comments request received with id: {}", articleId);

        return commentRepository.findByArticleId(articleId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private ArticleCommentResponseDTO mapToResponseDTO(ArticleComments comment) {
        try {
            UserResponseDto user = null;
            if ("DOCTOR".equalsIgnoreCase(comment.getUserType())) {
                DoctorResponseDTO doctor = userGrpcClient.getDoctor(comment.getUserId());
                user = modelMapper.map(doctor, UserResponseDto.class);
            } else if ("PATIENT".equalsIgnoreCase(comment.getUserType())) {
                PatientResponseDTO patient = userGrpcClient.getPatient(comment.getUserId());
                user = modelMapper.map(patient, UserResponseDto.class);
            } else {
                log.warn("Unknown user type in comment: {}", comment.getUserType());
            }

            ArticleCommentResponseDTO responseDTO = modelMapper.map(comment, ArticleCommentResponseDTO.class);
            responseDTO.setUserResponseDto(user);
            return responseDTO;

        } catch (MappingException e) {
            log.error("Error while mapping comment: {}", comment, e);
            throw new DataIntegrityViolation("Error while mapping comment");
        } catch (Exception e) {
            log.error("Unexpected error in comment mapping: {}", comment, e);
            throw new DataIntegrityViolation("Unexpected error while mapping comment");
        }
    }
}
