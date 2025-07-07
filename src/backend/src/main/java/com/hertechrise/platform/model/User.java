package com.hertechrise.platform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails, Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(length = 9, nullable = false)
    private String cep;

    @Column(length = 50, nullable = false)
    private String uf;

    @Column(length = 100, nullable = false)
    private String city;

    @Column(length = 100, nullable = false)
    private String street;

    @Column(length = 100, nullable = false)
    private String neighborhood;

    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType type;

    @Column(name = "user_handle", unique = true, nullable = false, length = 15)
    private String handle;

    @Column(name = "profile_pic", nullable = false, length = 255)
    private String profilePic; // url da imagem

    @Column(name = "external_link", length = 100)
    private String externalLink;

    // Campos do Spring Security
    @Column(name = "account_non_expired", nullable = false)
    private boolean accountNonExpired = true;

    @Column(name = "account_non_locked", nullable = false)
    private boolean accountNonLocked = true;

    @Column(name = "credentials_non_expired", nullable = false)
    private boolean credentialsNonExpired = true;

    @Column(nullable = false)
    private boolean enabled = true;

    @Override
    public String getUsername() {
        return this.email;
    }

    public boolean isProfessional() {
        return this.type == UserType.PROFESSIONAL;
    }

    // Relacionamentos com Role e Permission
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null || role.getPermissions() == null) return Collections.emptySet();

        return role.getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getDescription()))
                .collect(Collectors.toSet());
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof User user)) return false;
        return isAccountNonExpired() == user.isAccountNonExpired() && isAccountNonLocked() == user.isAccountNonLocked() && isCredentialsNonExpired() == user.isCredentialsNonExpired() && isEnabled() == user.isEnabled() && Objects.equals(getId(), user.getId()) && Objects.equals(getName(), user.getName()) && Objects.equals(getPhoneNumber(), user.getPhoneNumber()) && Objects.equals(getCep(), user.getCep()) && Objects.equals(getCity(), user.getCity()) && Objects.equals(getStreet(), user.getStreet()) && Objects.equals(getNeighborhood(), user.getNeighborhood()) && Objects.equals(getEmail(), user.getEmail()) && Objects.equals(getPassword(), user.getPassword()) && getType() == user.getType() && Objects.equals(getHandle(), user.getHandle()) && Objects.equals(getProfilePic(), user.getProfilePic()) && Objects.equals(getRole(), user.getRole());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getPhoneNumber(), getCep(), getCity(), getStreet(), getNeighborhood(), getEmail(), getPassword(), getType(), getHandle(), getProfilePic(), isAccountNonExpired(), isAccountNonLocked(), isCredentialsNonExpired(), isEnabled(), getRole());
    }
}
