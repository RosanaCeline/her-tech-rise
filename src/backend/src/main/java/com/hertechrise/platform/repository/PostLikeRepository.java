package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.PostLike;
import com.hertechrise.platform.model.PostShare;
import com.hertechrise.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    Optional<PostLike> findByUserAndPost(User user, Post post);

    List<PostLike> findByPost(Post post);

    long countByPostId(Long postId);

    Optional<PostLike> findByUserAndShare(User user, PostShare share);

    List<PostLike> findByShare(PostShare share);

    long countByShareId(Long shareId);
}
