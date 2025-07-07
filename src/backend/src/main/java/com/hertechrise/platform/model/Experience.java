package com.hertechrise.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "experience")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 150)
    private String company;

    @Column(nullable = false, length = 30)
    private String modality;

    @Column(name = "start_date" , nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_current", nullable = false)
    private boolean isCurrent;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "professional_id")
    private Professional professional;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Experience that)) return false;
        return isCurrent() == that.isCurrent() && Objects.equals(getId(), that.getId()) && Objects.equals(getTitle(), that.getTitle()) && Objects.equals(getCompany(), that.getCompany()) && Objects.equals(getModality(), that.getModality()) && Objects.equals(getStartDate(), that.getStartDate()) && Objects.equals(getEndDate(), that.getEndDate()) && Objects.equals(getDescription(), that.getDescription()) && Objects.equals(getProfessional(), that.getProfessional());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getTitle(), getCompany(), getModality(), getStartDate(), getEndDate(), isCurrent(), getDescription(), getProfessional());
    }
}