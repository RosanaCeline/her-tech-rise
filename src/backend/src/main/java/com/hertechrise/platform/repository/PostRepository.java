package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByAuthorOrderByCreatedAtDesc(User author);

    Page<Post> findAll(Specification<Post> spec, Pageable pageable);
}
