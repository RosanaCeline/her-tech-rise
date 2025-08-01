package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.PostComment;
import com.hertechrise.platform.model.PostShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    List<PostComment> findByPost(Post post);

    long countByPostId(Long postId);

    List<PostComment> findByShare(PostShare share);

    long countByShareId(Long shareId);
}
