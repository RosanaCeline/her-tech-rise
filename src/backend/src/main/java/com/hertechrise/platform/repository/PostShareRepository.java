package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.PostShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostShareRepository extends JpaRepository<PostShare, Long> {

    long countByPostId(Long postId);;
}
