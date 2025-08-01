package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {

    List<Post> findAllByAuthorIdAndDeletedFalse(Long authorId);
}
