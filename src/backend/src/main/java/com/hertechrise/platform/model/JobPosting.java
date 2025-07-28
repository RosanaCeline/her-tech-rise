package com.hertechrise.platform.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "job_posting",
        indexes = {
                @Index(name = "idx_job_company", columnList = "company_user_id"),
                @Index(name = "idx_job_active", columnList = "active"),
                @Index(name = "idx_job_active_deadline", columnList = "active, application_deadline")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobPosting implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false, length = 1000)
    private String requirements;

    @Column(nullable = false, length = 100)
    private String location; // cidade e-ou estado

    @Enumerated(EnumType.STRING)
    @Column(name = "job_model", nullable = false)
    private JobModel jobModel; // remoto, hibrido e presencial

    @Column(precision = 10, scale = 2)
    private BigDecimal salaryMin;

    @Column(precision = 10, scale = 2)
    private BigDecimal salaryMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false)
    private JobContractType contractType; // CLT, PJ, ESTAGIO, TRAINEE, TEMPORARIO, FREELANCER, VOLUNTARIO, APRENDIZ

    @Enumerated(EnumType.STRING)
    @Column(name = "job_level", nullable = false)
    private JobLevel joblevel; // junior, pleno e senior

    @Column(name = "application_deadline", nullable = false)
    private LocalDate applicationDeadline;

    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_updated", nullable = false)
    private boolean isUpdated = false;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "company_user_id",
            foreignKey = @ForeignKey(name = "fk_jobposting_company"))
    private Company company;

    @Transient
    public boolean isExpired() {
        return applicationDeadline != null && applicationDeadline.isBefore(LocalDate.now());
    }
}
