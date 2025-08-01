package com.hertechrise.platform.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment_likes")
@Getter
@Setter
public class CommentLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "comment_id")
    private PostComment comment;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;
}

