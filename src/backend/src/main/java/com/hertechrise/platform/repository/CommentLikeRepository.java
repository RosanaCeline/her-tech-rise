package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.CommentLike;
import com.hertechrise.platform.model.PostComment;
import com.hertechrise.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Collection;
import java.util.List;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    Optional<CommentLike> findByUserAndComment(User user, PostComment comment);

    List<CommentLike> findByComment(PostComment comment);

    long countByCommentId(Long commentId);

    @Query("""
        select l.comment.id, count(l) from CommentLike l
        where l.comment.id in :commentIds
        group by l.comment.id
    """)
    List<Object[]> countByCommentIds(@Param("commentIds") Collection<Long> commentIds);

    @Query("""
        select l.comment.id from CommentLike l
        where l.user.id = :userId and l.comment.id in :commentIds
    """)
    List<Long> findCommentIdsLikedByUser(@Param("userId") Long userId, @Param("commentIds") Collection<Long> commentIds);

    @Query("""
        select l from CommentLike l
        join fetch l.user
        where l.comment.id = :commentId
        order by l.createdAt desc
    """)
    List<CommentLike> findAllWithUserByCommentId(@Param("commentId") Long commentId);
}
