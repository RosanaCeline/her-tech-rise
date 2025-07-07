package com.hertechrise.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "company")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Company implements Serializable{

    private static final long serialVersionUID = 1L;

    @EqualsAndHashCode.Include
    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Enumerated(EnumType.STRING)
    @Column(name = "company_type", nullable = false)
    private CompanyType companyType;

    @Column(length = 400)
    private String description;

    @Column(name = "about_us", length = 1000)
    private String aboutUs;
}