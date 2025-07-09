package com.hertechrise.platform.services;
import com.hertechrise.platform.data.dto.request.RegisterProfessionalRequestDTO;
import com.hertechrise.platform.data.dto.response.TokenResponseDTO;
import com.hertechrise.platform.exception.CpfAlreadyRegisteredException;
import com.hertechrise.platform.exception.EmailAlreadyRegisteredException;
import com.hertechrise.platform.model.Professional;
import com.hertechrise.platform.model.Role;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.model.UserType;
import com.hertechrise.platform.services.AuthService;
import com.hertechrise.platform.repository.UserRepository;
import com.hertechrise.platform.repository.ProfessionalRepository;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest

class AuthServiceTest extends AbstractIntegrationTest {

    //injeções necessarias
    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfessionalRepository professionalRepository;

    @DisplayName("Registro de Profissional com Sucesso")
    @Test
    void registerProfessionalSucess() {



        //Given / Arrange (montar dados)

        //Registro de (Professional) /colocando os dados de profissional
        RegisterProfessionalRequestDTO request = new RegisterProfessionalRequestDTO("Rosana Celine","07900000000", LocalDate.of(2003,10,15),"88 00000000",
                "62320000","CE","Tianguá","Teste","Teste","rosana@test.com","senha1234");

        //When / ACT
        //salvando no banco de dados
        TokenResponseDTO response = authService.registerProfessional(request);


        //Then / Assert - verificação de saida
        // fazend a ver de respons e token não nullo
        assertNotNull(response);
        assertNotNull(response.token());

        //veridicar se foi salvo no banco (de forma certa)
        Optional<User> savedUser = userRepository.findByEmail("rosana@test.com");
        assertTrue(savedUser.isPresent());
        assertEquals("Rosana Celine", savedUser.get().getName());
        assertEquals(UserType.PROFESSIONAL, savedUser.get().getType());

        // Verifica o profissional
        Optional<Professional> savedProfessional = professionalRepository.findByCpf("07900000000");
        assertTrue(savedProfessional.isPresent());
        assertEquals(LocalDate.of(2003, 10, 15), savedProfessional.get().getBirthDate());
        assertEquals(savedUser.get().getId(), savedProfessional.get().getUser().getId());

        // Verifica o token de resposta
        assertEquals("Rosana Celine", response.name());
        assertEquals("PROFESSIONAL", response.role());

    }
    //metodo pra excessao pra testar erro
    @DisplayName("")
    @Test
    void registerProfessional_ThrowsException(){
        //fingir que o usuario ja existe

        //Registro de (Professional) /colocando os dados de profissional
        RegisterProfessionalRequestDTO request = new RegisterProfessionalRequestDTO("Rosana Celine","07900000000", LocalDate.of(2003,10,15),"88 00000000",
                "62320000","CE","Tianguá","Teste","Teste","rosana@test.com","senha1234");

        authService.registerProfessional(request);

        //testando excessao de email
        EmailAlreadyRegisteredException exception = assertThrows(EmailAlreadyRegisteredException.class, () -> {
            authService.registerProfessional(request);
        });

    }


    @DisplayName("Registro de Company")
    @Test
    void registerCompanySucess(){}



}