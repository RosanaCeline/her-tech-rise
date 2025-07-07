package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.FollowRelationship;
import com.hertechrise.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowRelationshipRepository extends JpaRepository<FollowRelationship, Long> {

    boolean existsByFollowerAndFollowing(User follower, User following);

    void deleteByFollowerAndFollowing(User follower, User following);

    long countByFollowing(User following);

    List<FollowRelationship> findAllByFollower(User follower);
    List<FollowRelationship> findAllByFollowing(User following);
}
