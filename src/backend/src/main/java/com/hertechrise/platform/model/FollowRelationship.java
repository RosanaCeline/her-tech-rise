package com.hertechrise.platform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "follow_relationship",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_follow_pair",
                columnNames = {"follower_id", "following_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Check(constraints = "follower_id <> following_id")
public class FollowRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Quem está seguindo */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "follower_id",
            foreignKey = @ForeignKey(name = "fk_follow_follower"))
    private User follower;

    /** Quem está sendo seguido */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "following_id",
            foreignKey = @ForeignKey(name = "fk_follow_following"))
    private User following;

    @CreationTimestamp
    @Column(name = "followed_at", nullable = false, updatable = false)
    private LocalDateTime followedAt;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof FollowRelationship that)) return false;
        return Objects.equals(getId(), that.getId()) && Objects.equals(getFollower(), that.getFollower()) && Objects.equals(getFollowing(), that.getFollowing()) && Objects.equals(getFollowedAt(), that.getFollowedAt());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getFollower(), getFollowing(), getFollowedAt());
    }
}
