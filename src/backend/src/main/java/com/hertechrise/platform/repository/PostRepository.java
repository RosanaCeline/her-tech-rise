package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {

    List<Post> findAllByAuthorIdAndDeletedFalse(Long authorId);

    @Query("""
        select distinct p from Post p
        join fetch p.author
        left join fetch p.media
        where p.id in :ids
    """)
    List<Post> findAllWithAuthorAndMediaByIdIn(@Param("ids") Collection<Long> ids);
}
