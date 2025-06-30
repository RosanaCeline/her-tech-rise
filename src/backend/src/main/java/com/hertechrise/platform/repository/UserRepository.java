package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.User;
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

    boolean existsByHandle(String username);
}
