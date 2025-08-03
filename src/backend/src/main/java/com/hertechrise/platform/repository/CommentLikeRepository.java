package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.CommentLike;
import com.hertechrise.platform.model.PostComment;
import com.hertechrise.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    Optional<CommentLike> findByUserAndComment(User user, PostComment comment);

    List<CommentLike> findByComment(PostComment comment);

    long countByCommentId(Long commentId);
}
