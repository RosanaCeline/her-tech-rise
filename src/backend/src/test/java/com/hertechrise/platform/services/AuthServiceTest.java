package com.hertechrise.platform.services;
import com.hertechrise.platform.data.dto.request.*;
import com.hertechrise.platform.data.dto.response.TokenResponseDTO;
import com.hertechrise.platform.exception.*;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.security.jwt.ResetPasswordTokenService;
import org.springframework.security.authentication.AuthenticationManager;
import com.hertechrise.platform.repository.CompanyRepository;
import com.hertechrise.platform.repository.RoleRepository;
import com.hertechrise.platform.services.AuthService;
import com.hertechrise.platform.repository.UserRepository;
import com.hertechrise.platform.repository.ProfessionalRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDate;
import java.util.Optional;
import com.hertechrise.platform.exception.EmailAlreadyRegisteredException;
import com.hertechrise.platform.exception.AccountDisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.hertechrise.platform.exception.CnpjAlreadyRegisteredException;
import com.hertechrise.platform.exception.UserNotFoundException;
import org.springframework.test.context.ActiveProfiles;
import com.hertechrise.platform.security.jwt.ResetPasswordTokenService;
import com.hertechrise.platform.security.jwt.TokenService;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthServiceTest extends AbstractIntegrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfessionalRepository professionalRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ResetPasswordTokenService resetTokenService;

    @Autowired
    private ResetPasswordTokenService resetPasswordTokenService;

    @BeforeEach
    void cleanUpDatabase() {
        professionalRepository.deleteAll();
        companyRepository.deleteAll();
        userRepository.deleteAll();
    }

    @DisplayName("Registro de Profissional com Sucesso")
    @Test
    void registerProfessionalSuccess() {

        //Given / Arrange (montar dados)
        RegisterProfessionalRequestDTO request = new RegisterProfessionalRequestDTO("Rosana Celine","07900000000", LocalDate.of(2003,10,15),"88 00000000",
                "62320000","CE","Tianguá","Teste","Teste","rosana@test.com","senha1234");

        //When / ACT
        TokenResponseDTO response = authService.registerProfessional(request);

        //Then / Assert - verificação de saida
        assertNotNull(response);
        assertNotNull(response.token());
        assertEquals("PROFESSIONAL", response.role());

        //verificar se foi salvo no banco (de forma certa)
        Optional<User> savedUserOpt = userRepository.findByEmail("rosana@test.com");
        assertTrue(savedUserOpt.isPresent());
        User savedUser = savedUserOpt.get();
        assertEquals("Rosana Celine", savedUser.getName());
        assertEquals(UserType.PROFESSIONAL, savedUser.getType());
        assertEquals("62320000", savedUser.getCep());
        assertEquals("CE", savedUser.getUf());
        assertEquals("Tianguá", savedUser.getCity());
        assertEquals("Teste", savedUser.getStreet());
        assertNotEquals("senha1234", savedUser.getPassword()); // senha deve estar criptografada
        assertEquals(savedUser.getId(), response.id());

        Optional<Professional> savedProfessionalOpt = professionalRepository.findByCpf("07900000000");
        assertTrue(savedProfessionalOpt.isPresent());
        Professional savedProfessional = savedProfessionalOpt.get();
        assertEquals(LocalDate.of(2003, 10, 15), savedProfessional.getBirthDate());
        assertEquals(savedUser.getId(), savedProfessional.getUser().getId());


        // Verifica o token de resposta
        assertEquals("Rosana Celine", response.name());
        assertEquals("PROFESSIONAL", response.role());

    }

    @DisplayName("Deve lançar EmailAlreadyRegisteredException para email já cadastrado")
    @Test
    void registerEmailProfessional_ThrowsException(){

        RegisterProfessionalRequestDTO request = new RegisterProfessionalRequestDTO("Rosana Celine", "07900000000", LocalDate.of(2003, 10, 15), "88 00000000", "62320000", "CE", "Tianguá", "Teste",
                "Teste", "rosana@test.com", "senha1234"
        );

        authService.registerProfessional(request);

        EmailAlreadyRegisteredException exception = assertThrows(
                EmailAlreadyRegisteredException.class,
                () -> authService.registerProfessional(request)
        );

        assertEquals("E-mail já cadastrado.", exception.getMessage());
    }

    @DisplayName("Deve lançar ProfessionalCpfAlreadyRegisteredException para CPF já cadastrado")
    @Test
    void registerCpfProfessional_ThrowsException(){

        RegisterProfessionalRequestDTO request1 = new RegisterProfessionalRequestDTO("Rosana Celine", "07900000000", LocalDate.of(2003, 10, 15), "88 00000000", "62320000", "CE", "Tianguá", "Teste",
                "Teste", "rosana1@test.com", "senha1234"
        );
        authService.registerProfessional(request1);

        RegisterProfessionalRequestDTO request = new RegisterProfessionalRequestDTO("Rosana Celine", "07900000000", LocalDate.of(2003, 10, 15), "88 00000000", "62320000", "CE", "Tianguá", "Teste",
                "Teste", "rosana2@test.com", "senha1234"
        );

        CpfAlreadyRegisteredException exception = assertThrows(
                CpfAlreadyRegisteredException.class,
                () -> authService.registerProfessional(request)
        );

        assertEquals("Cpf já registrado.", exception.getMessage());

    }

    @DisplayName("Registro de Empresa com Sucesso")
    @Test
    void registerCompanySuccess() {

        RegisterCompanyRequestDTO request = new RegisterCompanyRequestDTO("Company", "12345678000100", CompanyType.NACIONAL, "88 99999999", "62320000", "CE", "Ubajara", "Teste", "teste", "company@test.com", "senha123");
        TokenResponseDTO response = authService.registerCompany(request);

        assertNotNull(response);
        assertNotNull(response.token());
        assertEquals("COMPANY", response.role());

        Optional<User> savedUser = userRepository.findByEmail("company@test.com");
        assertTrue(savedUser.isPresent());
        assertEquals("Company", savedUser.get().getName());
        assertEquals(UserType.COMPANY, savedUser.get().getType());


        Optional<Company> savedCompany = companyRepository.findByCnpj("12345678000100");
        assertTrue(savedCompany.isPresent());
        assertEquals(CompanyType.NACIONAL, savedCompany.get().getCompanyType());
        assertEquals(savedUser.get().getId(), savedCompany.get().getUser().getId());

        assertEquals("Company", response.name());
        assertEquals("COMPANY", response.role());
    }

    @DisplayName("Deve lançar CompanyEmailAlreadyRegisteredException para email já cadastrado")
    @Test
    void registerEmailCompany_ThrowsException() {

        RegisterCompanyRequestDTO request = new RegisterCompanyRequestDTO("Company", "12345678000100", CompanyType.NACIONAL, "88 99999999", "62320000", "CE", "Ubajara", "Teste", "teste", "company@test.com", "senha123");

        authService.registerCompany(request);

        EmailAlreadyRegisteredException exception = assertThrows(
                EmailAlreadyRegisteredException.class,
                () -> authService.registerCompany(request)
        );

        assertEquals("E-mail já cadastrado.", exception.getMessage());

    }

    @DisplayName("Deve lançar CompanyCnpjAlreadyRegisteredException para CNPJ já cadastrado")
    @Test
    void registerCnpjCompany_ThrowsException() {
        RegisterCompanyRequestDTO request1 = new RegisterCompanyRequestDTO("Company", "12345678000100", CompanyType.NACIONAL, "88 99999999", "62320000", "CE", "Ubajara", "Teste", "teste", "Company@test.com", "senha123");

        authService.registerCompany(request1);


        //testando msm cnpj e email diferente
        RegisterCompanyRequestDTO request = new RegisterCompanyRequestDTO("Company1", "12345678000100", CompanyType.NACIONAL, "88 99999999", "62320000", "CE", "Ubajara", "Teste", "teste", "jaburanga@test.com", "senha123");

        CnpjAlreadyRegisteredException exception = assertThrows(
                CnpjAlreadyRegisteredException.class,
                () -> authService.registerCompany(request)
        );

        assertEquals("Cnpj já registrado.",exception.getMessage());

    }

    @DisplayName("Login de usuário com sucesso ")
    @Test
    void loginSuccess(){
        //new user
        User user = new User();
        user.setName("Thalyta Lima");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("thalyta@test.com");
        user.setPassword(passwordEncoder.encode("senha1234"));
        user.setType(UserType.PROFESSIONAL);
        user.setHandle("thalyta123");
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);
        user.setEnabled(true);

        userRepository.save(user);

        LoginRequestDTO loginRequestDTO= new LoginRequestDTO("thalyta@test.com","senha1234");

        TokenResponseDTO response = authService.login(loginRequestDTO);

        assertNotNull(response);
        assertNotNull(response.token());

        // ASSERT
        assertEquals("Thalyta Lima",response.name());
        assertEquals("PROFESSIONAL",response.role());

    }

    @DisplayName("Deve lançar Exception UserNotFoundException para usuário autenticado não encontrado")
    @Test
    void login_ThrowExceptionUserNotFoundException(){

        //simular criação
        User user = new User();
        user.setName("Thalyta Lima");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("thalyta@test.com");
        user.setPassword(passwordEncoder.encode("senha1234"));
        user.setType(UserType.PROFESSIONAL);
        user.setHandle("thalyta123");
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");

        // habilitando o usuário
        user.setEnabled(true);
        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);

        LoginRequestDTO loginRequest = new LoginRequestDTO("nulo@email.com", "senha1234");

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Usuário autenticado não encontrado.", exception.getMessage());
    }

    @DisplayName("Deve lançar AccountDisabledException para Conta de usuário desativada")
    @Test
    void login_ThrowExceptionAccountDisabledException(){
        User user = new User();
        user.setName("Thalyta Lima");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("thalyta@test.com");
        user.setPassword(passwordEncoder.encode("senha1234"));
        user.setType(UserType.PROFESSIONAL);
        user.setHandle("thalyta123");
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");


        // deshabilitando o usuario
        user.setEnabled(false);
        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);
        userRepository.save(user);

        LoginRequestDTO loginRequest= new LoginRequestDTO("thalyta@test.com","senha1234");

        // tratando exception
        AccountDisabledException exception = assertThrows(AccountDisabledException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Conta de usuário desativada.", exception.getMessage());
    }

    @DisplayName("Deve lançar InvalidPasswordException para senha incorreta")
    @Test
    void login_ThrowExceptionInvalidPasswordException(){
        User user = new User();
        user.setName("Thalyta Lima");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("thalyta@test.com");
        user.setPassword(passwordEncoder.encode("senha1234"));
        user.setType(UserType.PROFESSIONAL);
        user.setHandle("thalyta123");
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);

        // habilitando o usuario
        user.setEnabled(true);

        userRepository.save(user);

        LoginRequestDTO loginRequestDTO= new LoginRequestDTO("thalyta@test.com","senhaerrada");

        InvalidPasswordException exception = assertThrows(InvalidPasswordException.class, () -> {
            authService.login(loginRequestDTO);
        });

        assertEquals("Senha incorreta.", exception.getMessage());

    }
    @DisplayName("resetPasswordSuccess")
    @Test
    void resetPasswordSuccess(){

        User user = new User();
        user.setName("Thalyta Lima");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("thalyta@test.com");
        user.setPassword(passwordEncoder.encode("senha1234"));
        user.setType(UserType.PROFESSIONAL);
        user.setHandle("thalyta123");
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow();
        user.setRole(role);

        userRepository.save(user);

        ResetPasswordRequestDTO request = new ResetPasswordRequestDTO(user.getEmail());

        // Act
        authService.resetPassword(request);
    }

    @Test
    void resetPassword_ExceptionUserNotFound() {
        User user = new User();
        user.setName("Thalyta Lima");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("thalyta@test.com");
        user.setPassword(passwordEncoder.encode("senha1234"));
        user.setType(UserType.PROFESSIONAL);
        user.setHandle("thalyta123");
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);

        // habilitando o usuario
        user.setEnabled(true);

        userRepository.save(user);

        ResetPasswordRequestDTO request = new ResetPasswordRequestDTO("test@email.com");

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            authService.resetPassword(request);
        });
        assertEquals("Usuário autenticado não encontrado.", exception.getMessage());
    }

    @DisplayName("confirmResetPasswordSucess")
    @Test
    void confirmResetPasswordSuccess(){
        User user = new User();
        user.setName("Thalyta Lima");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("thalyta@test.com");
        user.setPassword(passwordEncoder.encode("senha1234"));
        user.setType(UserType.PROFESSIONAL);
        user.setHandle("thalyta123");
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");
        user.setEnabled(true);
        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);

        
        userRepository.save(user);
        String tokenTest = resetTokenService.generateResetToken(user.getEmail());
        ConfirmedResetPasswordRequestDTO dto = new ConfirmedResetPasswordRequestDTO(tokenTest, "novaSenhadethalyta");
        authService.confirmResetPassword(dto);
        User newPass = userRepository.findByEmail(user.getEmail()).orElseThrow();
        assertTrue(passwordEncoder.matches("novaSenhadethalyta",newPass.getPassword()));
    }

}


