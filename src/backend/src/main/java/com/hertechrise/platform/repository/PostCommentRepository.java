package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.PostComment;
import com.hertechrise.platform.model.PostShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    List<PostComment> findByPost(Post post);

    long countByPostId(Long postId);

    List<PostComment> findByShare(PostShare share);

    long countByShareId(Long shareId);

    @Query("""
        select c.post.id, count(c) from PostComment c
        where c.post.id in :postIds
        group by c.post.id
    """)
    List<Object[]> countByPostIds(@Param("postIds") Collection<Long> postIds);

    @Query("""
        select c.share.id, count(c) from PostComment c
        where c.share.id in :shareIds
        group by c.share.id
    """)
    List<Object[]> countByShareIds(@Param("shareIds") Collection<Long> shareIds);

    @Query("""
        select c from PostComment c
        join fetch c.user
        where c.post.id = :postId
        order by c.createdAt asc
    """)
    List<PostComment> findAllWithUserByPostId(@Param("postId") Long postId);

    @Query("""
        select c from PostComment c
        join fetch c.user
        where c.share.id = :shareId
        order by c.createdAt asc
    """)
    List<PostComment> findAllWithUserByShareId(@Param("shareId") Long shareId);
}
