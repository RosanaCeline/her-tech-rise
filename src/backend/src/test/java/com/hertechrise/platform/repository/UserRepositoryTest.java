package com.hertechrise.platform.repository;
import com.hertechrise.platform.config.DotenvInitializer;
import org.junit.jupiter.api.Test;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.model.UserType;
import com.hertechrise.platform.model.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback
@ContextConfiguration(initializers = DotenvInitializer.class)
class UserRepositoryTest extends AbstractIntegrationTest{
//usando Bd com TestContainer(banco de dados temporario(dinamico)


    //injeção de dependencias
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @DisplayName("Busca usuario pelo e-mail")
    @Test
    void findByEmail() {
        //Given/ Arrange
        Role role = new Role();
        role.setName("USER");
        roleRepository.save(role);

        User user = new User();
        user.setName("Cláudia Souza");
        user.setPhoneNumber("8800000000");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim Lourenço");
        user.setNeighborhood("Centro");
        user.setEmail("claudia-test@test.com");
        user.setPassword("senha123");
        user.setType(UserType.PROFESSIONAL);
        user.setHandle("claudia123");
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png"); //foto padrão (professional)
        user.setUf("CE");
        user.setRole(role);

        //When /ACT
        userRepository.save(user);

        // Then // Assert
        //Resultado esperado
        assertTrue(userRepository.findByEmail("claudia-test@test.com").isPresent());

    }
    @DisplayName("Verificação de handle existentes - true | false ")
    @Test
    void existsByHandle() {

       //Given / Arrange
        Role role = new Role();
        role.setName("USER1");
        roleRepository.save(role);


        User user = new User();
        user.setName("Thais");
        user.setPhoneNumber("8898888888");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Teste");
        user.setNeighborhood("Bairro");
        user.setEmail("thais@test.com");
        user.setPassword("senha1234");
        user.setType(UserType.COMPANY);
        user.setHandle("thais123");
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");
        user.setRole(role);

        //When /ACT
        userRepository.save(user);

        // Then // Assert

        //Se handle existir retorna true
        assertTrue(userRepository.existsByHandle("thais123"));

        //else - retorna false
        assertFalse(userRepository.existsByHandle("Não Existe"));

    }

}
