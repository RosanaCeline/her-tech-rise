package com.hertechrise.platform.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "post_comment",
        indexes = {
                @Index(name = "idx_post_comment_post", columnList = "post_id"),
                @Index(name = "idx_post_comment_share", columnList = "share_id"),
                @Index(name = "idx_post_comment_user", columnList = "user_id"),
                @Index(name = "idx_post_comment_parent", columnList = "parent_comment_id")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PostComment {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", foreignKey = @ForeignKey(name = "fk_post_comment_post"))
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "share_id", foreignKey = @ForeignKey(name = "fk_post_comment_share"))
    private PostShare share;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_post_comment_user"))
    private User user;

    @Column(name = "content", nullable = false, length = 3000)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id", foreignKey = @ForeignKey(name = "fk_post_comment_parent"))
    private PostComment parentComment;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "edited", nullable = false)
    private boolean edited = false;

    @Column(name = "edited_at")
    private LocalDateTime editedAt;
}
