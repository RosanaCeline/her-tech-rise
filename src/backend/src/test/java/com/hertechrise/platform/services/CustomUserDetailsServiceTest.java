
package com.hertechrise.platform.services;
import com.hertechrise.platform.exception.InvalidUserTypeException;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.Role;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.model.UserType;
import com.hertechrise.platform.repository.RoleRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import com.hertechrise.platform.exception.UserNotFoundException;
import com.hertechrise.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CustomUserDetailsServiceTest extends AbstractIntegrationTest {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;


    @DisplayName("Procurar por user (email) de usuário")
    @Test
    void loadUserByUsernameSuccess() {
        //Given / Arrange
        User user = new User();
        user.setName("Thalyta Lima");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("thalyta@test.com");
        user.setPassword("senha1234");
        user.setType(UserType.PROFESSIONAL);
        user.setHandle("thalyta123");
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);

        userRepository.save(user);

        //When / ACT
        UserDetails userDetails = userDetailsService.loadUserByUsername("thalyta@test.com");

        // Then / Assert
        assertNotNull(userDetails);
        assertEquals("thalyta@test.com", userDetails.getUsername());

    }

    @DisplayName("User Not Found Exception para quando usuário não for encontrado")
    @Test
    void loadUserByUsername_ThrowException() {

        //Given / Arrange

        //criando usuário no BD(mas sem salvar)
        User user = new User();
        user.setName("Thalyta Lima");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("thalyta@test.com");
        user.setPassword("senha1234");
        user.setType(UserType.PROFESSIONAL);
        user.setHandle("thalyta123");
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");


        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername(user.getEmail());
        });
        //Then / Assert
        assertEquals("Usuário autenticado não encontrado.", exception.getMessage());
    }
}