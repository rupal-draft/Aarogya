package com.aarogya.article_service.repository;

import com.aarogya.article_service.document.Articles;
import io.grpc.netty.shaded.io.netty.handler.codec.http2.Http2Connection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends MongoRepository<Articles, String> {

    List<Articles> findByDoctorId(String doctorId);

    List<Articles> findByCategoryIgnoreCase(String category);

    List<Articles> findByTitleContainingIgnoreCase(String title);

    List<Articles> findTop4ByOrderByCreatedAtDesc();

    List<Articles> findTop4ByOrderByViewsDesc();

    @Query("{ '$or': [ { 'title': { $regex: ?0, $options: 'i' } }, { 'content': { $regex: ?0, $options: 'i' } } ] }")
    List<Articles> searchByTitleOrContent(String keyword);
}
