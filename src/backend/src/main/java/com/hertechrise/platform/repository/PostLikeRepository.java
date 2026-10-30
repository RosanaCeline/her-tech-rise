package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.PostLike;
import com.hertechrise.platform.model.PostShare;
import com.hertechrise.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
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

    @Query("""
        select l.post.id, count(l) from PostLike l
        where l.post.id in :postIds
        group by l.post.id
    """)
    List<Object[]> countByPostIds(@Param("postIds") Collection<Long> postIds);

    @Query("""
        select l.share.id, count(l) from PostLike l
        where l.share.id in :shareIds
        group by l.share.id
    """)
    List<Object[]> countByShareIds(@Param("shareIds") Collection<Long> shareIds);

    @Query("""
        select l.post.id from PostLike l
        where l.user.id = :userId and l.post.id in :postIds
    """)
    List<Long> findPostIdsLikedByUser(@Param("userId") Long userId, @Param("postIds") Collection<Long> postIds);

    @Query("""
        select l.share.id from PostLike l
        where l.user.id = :userId and l.share.id in :shareIds
    """)
    List<Long> findShareIdsLikedByUser(@Param("userId") Long userId, @Param("shareIds") Collection<Long> shareIds);

    @Query("""
        select l from PostLike l
        join fetch l.user
        where l.post.id = :postId
        order by l.createdAt desc
    """)
    List<PostLike> findAllWithUserByPostId(@Param("postId") Long postId);

    @Query("""
        select l from PostLike l
        join fetch l.user
        where l.share.id = :shareId
        order by l.createdAt desc
    """)
    List<PostLike> findAllWithUserByShareId(@Param("shareId") Long shareId);
}
