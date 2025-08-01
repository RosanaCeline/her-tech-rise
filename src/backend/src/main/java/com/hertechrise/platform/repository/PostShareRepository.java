package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.PostShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostShareRepository extends JpaRepository<PostShare, Long> {

    long countByPostId(Long postId);

    List<PostShare> findAllByUserId(Long userId);

    @Query("""
        select ps from PostShare ps
        where ps.user.id = :userId
           or (ps.post.visibility = 'PUBLICO')
    """)
    List<PostShare> findAllByUserIdOrPublic(@Param("userId") Long userId);

}
