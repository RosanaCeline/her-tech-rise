package com.hertechrise.platform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.Where;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_application", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"job_posting_id", "professional_user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FilterDef(name = "deletedFilter", parameters = @ParamDef(name = "isDeleted", type = Boolean.class))
@Filter(name = "deletedFilter", condition = "deleted = :isDeleted")
public class JobApplication implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_posting_id", nullable = false)
    private JobPosting jobPosting;

    @ManyToOne
    @JoinColumn(name = "professional_user_id", nullable = false)
    private Professional professional;

    @Column(name = "github_link", length = 1000)
    private String githubLink;

    @Column(name = "portfolio_link", length = 1000)
    private String portfolioLink;

    @Column(name = "resume_url", nullable = false, length = 1000)
    private String resumeUrl;

    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;

    @Column(nullable = false)
    private boolean deleted = false;
}

