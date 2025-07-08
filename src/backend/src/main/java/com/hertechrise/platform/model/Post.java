package com.hertechrise.platform.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "post",
        indexes = {
                @Index(name = "idx_post_author", columnList = "author_id"),
                @Index(name = "idx_post_created", columnList = "created_at")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Post {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id",
            foreignKey = @ForeignKey(name = "fk_post_author"))
    private User author;

    @Column(name = "content", nullable = false, length = 3000)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // comunidade - opcional
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id",
            foreignKey = @ForeignKey(name = "fk_post_community"))
    private Community community;

    @OneToMany(mappedBy = "post",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private List<Media> media = new ArrayList<>();
}