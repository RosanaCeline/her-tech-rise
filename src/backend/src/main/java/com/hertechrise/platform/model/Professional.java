package com.hertechrise.platform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "professional")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Professional implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(length = 80)
    private String technology;

    @Column(length = 1000)
    private String biography;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProfessionalGender gender;

    @Column(name = "consent_gender_sharing", nullable = false)
    private Boolean consentGenderSharing;

    @OneToMany(mappedBy = "professional", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Experience> experiences = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Professional that)) return false;
        return Objects.equals(getUserId(), that.getUserId()) && Objects.equals(getUser(), that.getUser()) && Objects.equals(getCpf(), that.getCpf()) && Objects.equals(getBirthDate(), that.getBirthDate()) && Objects.equals(getTechnology(), that.getTechnology()) && Objects.equals(getBiography(), that.getBiography()) && Objects.equals(getExperiences(), that.getExperiences());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getUserId(), getUser(), getCpf(), getBirthDate(), getTechnology(), getBiography(), getExperiences());
    }
}