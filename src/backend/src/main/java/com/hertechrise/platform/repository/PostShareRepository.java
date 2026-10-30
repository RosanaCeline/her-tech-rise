package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.PostShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PostShareRepository extends JpaRepository<PostShare, Long> {

    long countByPostId(Long postId);

    List<PostShare> findAllByUserId(Long userId);

    @Query("""
        select ps from PostShare ps
        where ps.user.id = :userId
    """)
    List<PostShare> findAllSharesByUserId(@Param("userId") Long userId);

    @Query("""
        select ps from PostShare ps
        where ps.user.id = :userId
           or (ps.post.visibility = 'PUBLICO')
    """)
    List<PostShare> findSharesForTimeline(@Param("userId") Long userId);

    @Query("""
        select ps from PostShare ps
        join fetch ps.user
        where ps.id in :ids
    """)
    List<PostShare> findAllWithUserByIdIn(@Param("ids") Collection<Long> ids);

    @Query("""
        select ps.post.id, count(ps) from PostShare ps
        where ps.post.id in :postIds
        group by ps.post.id
    """)
    List<Object[]> countByPostIds(@Param("postIds") Collection<Long> postIds);
}
