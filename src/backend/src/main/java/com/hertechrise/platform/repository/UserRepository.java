package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.User;
import com.hertechrise.platform.model.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.email =:email")
    User findByUsername(@Param("email") String email);

    Optional<User> findByEmail(String email);

    boolean existsByHandle(String handle);

    // métodos prontos do Spring Data combinando campos
    Page<User> findByTypeAndNameContainingIgnoreCaseOrTypeAndHandleContainingIgnoreCase(
            UserType type1, String name,
            UserType type2, String handle,
            Pageable pageable);

    // projeção para poupar dados (interface‑based projection)
    interface Summary {
        Long getId();
        String getName();
        String getHandle();
        String getCity();
        String getProfilePic();
    }

    <T> Page<T> findByTypeAndIdNotAndNameContainingIgnoreCaseOrTypeAndIdNotAndHandleContainingIgnoreCase(
            UserType t1, Long excludedId1, String name,
            UserType t2, Long excludedId2, String handle,
            Pageable pageable,
            Class<T> projection);
}
