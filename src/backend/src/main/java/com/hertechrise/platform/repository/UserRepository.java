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
    interface ProfessionalSummary {
        Long getId();
        String getName();
        String getHandle();
        String getTechnology();
        String getCity();
        String getUf();
        String getProfilePic();
    }

    interface CompanySummary {
        Long getId();
        String getName();
        String getHandle();
        String getCity();
        String getUf();
        String getProfilePic();
    }

<<<<<<< HEAD
=======
    @Query("""
        SELECT u.id AS id, u.name AS name, u.handle AS handle, 
               p.technology AS technology, u.city AS city, u.uf AS uf, u.profilePic AS profilePic
        FROM User u
        JOIN Professional p ON u.id = p.id
        WHERE u.type = 'PROFESSIONAL' AND u.id <> :excludedId 
          AND (LOWER(u.name) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(u.handle) LIKE LOWER(CONCAT('%', :term, '%')))
    """)
    Page<ProfessionalSummary> searchProfessionalsPagedWithTechnology(@Param("term") String term, @Param("excludedId") Long excludedId, Pageable pageable);


>>>>>>> main
    <T> Page<T> findByTypeAndIdNotAndNameContainingIgnoreCaseOrTypeAndIdNotAndHandleContainingIgnoreCase(
            UserType t1, Long excludedId1, String name,
            UserType t2, Long excludedId2, String handle,
            Pageable pageable,
            Class<T> projection);
}
