package com.hertechrise.platform.services;
import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.data.dto.request.CompanyProfileRequestDTO;
import com.hertechrise.platform.data.dto.response.*;
import com.hertechrise.platform.data.dto.response.CompanyProfileResponseDTO;
import com.hertechrise.platform.exception.CompanyNotFoundException;
import com.hertechrise.platform.exception.InvalidUserTypeException;
import com.hertechrise.platform.exception.UserNotFoundException;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.UserRepository;
import com.hertechrise.platform.repository.*;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;
import java.util.Random;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
@Transactional
@Rollback
@ContextConfiguration(initializers = DotenvInitializer.class)
class CompanyProfileServiceTest extends AbstractIntegrationTest {

    @Autowired
    private CompanyProfileService companyProfileService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private FollowRelationshipRepository followRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private RoleRepository roleRepository;


    private Company createTestCompanyUser(String name, String email, String handle, String description, String aboutUs) {
        User user = new User();
        user.setName(name);
        user.setEnabled(true);
        user.setUf("CE");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setEmail(email);
        user.setNeighborhood("Centro");
        user.setStreet("Test");
        user.setHandle(handle);
        user.setPhoneNumber("88999990000");
        user.setPassword("senhasegura123");
        user.setType(UserType.COMPANY);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("COMPANY")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);


        Company company = new Company();
        company.setCnpj(company.getCnpj());
        company.setCompanyType(CompanyType.NACIONAL);
        company.setCnpj(String.format("%014d", Math.abs(new Random().nextLong()) % 10_000_000_000_000L));
        company.setDescription(description);
        company.setAboutUs(aboutUs);
        company.setUser(user);
        companyRepository.save(company);

        return company;
    }

    @DisplayName("Visualizar detalhes de outra Empresa a partir do ID")
    @Test
    void viewOtherCompanyProfile() {
        Company company = createTestCompanyUser("Hertech", "hert@test.com", "@hertech", "Descrição teste", "Sobre nós");

        Post post_1 = new Post();
        post_1.setAuthor(company.getUser());
        post_1.setContent("Olá mundo!");
        post_1.setCreatedAt(LocalDateTime.now());
        post_1.setVisibility(PostVisibility.PUBLICO);
        postRepository.save(post_1);

        Post post_2 = new Post();
        post_2.setAuthor(company.getUser());
        post_2.setContent("Olá mundo!");
        post_2.setCreatedAt(LocalDateTime.now());
        post_2.setVisibility(PostVisibility.PRIVADO);
        postRepository.save(post_2);

        Company loggedUserCompany = createTestCompanyUser(
                "User",
                "user@test.com",
                "@user",
                "Descrição teste",
                "Sobre nós"
        );

        FollowRelationship followRelationship = new FollowRelationship();
        followRelationship.setFollower(loggedUserCompany.getUser());
        followRelationship.setFollowing(company.getUser());
        followRepository.save(followRelationship);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        loggedUserCompany.getUser(), null, List.of()
                );
        SecurityContextHolder.getContext().setAuthentication(auth);

        CompanyProfileResponseDTO response = companyProfileService.getProfile(company.getUser().getId());

        assertNotNull(response);
        assertEquals("Hertech", response.name());
        assertEquals("hert@test.com", response.email());
        assertEquals("@hertech", response.handle());
        assertEquals("Descrição teste", response.description());
        assertEquals("Sobre nós", response.aboutUs());
        assertEquals(1, response.followersCount());
        assertEquals(1, response.posts().size());
        assertEquals("Olá mundo!", response.posts().get(0).content());
    }

    @DisplayName("Visualizar detalhes do próprio perfil")
    @Test
    void viewOwnCompanyProfile() {
        Company company = createTestCompanyUser("Hertech", "hert@test.com", "@hertech", "Descrição teste", "Sobre nós");

        Post post_1 = new Post();
        post_1.setAuthor(company.getUser());
        post_1.setContent("Olá mundo!");
        post_1.setCreatedAt(LocalDateTime.now());
        post_1.setVisibility(PostVisibility.PUBLICO);
        postRepository.save(post_1);

        Post post_2 = new Post();
        post_2.setAuthor(company.getUser());
        post_2.setContent("Olá mundo!");
        post_2.setCreatedAt(LocalDateTime.now());
        post_2.setVisibility(PostVisibility.PRIVADO);
        postRepository.save(post_2);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        CompanyProfileResponseDTO requset = companyProfileService.getProfile(company.getUser().getId());

        assertNotNull(requset);
        assertEquals("Hertech", requset.name());
        assertEquals("hert@test.com", requset.email());
        assertEquals(0, requset.followersCount());
        assertEquals(2, requset.posts().size());
    }


    @DisplayName("Deve lançar UserNotFoundException para usuário não existente")
    @Test
    void viewProfileOfUserThatDoesNotExist() {

        Company loggedUser = createTestCompanyUser("Hertech", "hert@test.com", "@hertech", "Descrição teste", "Sobre nós");


        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            companyProfileService.getProfile(9999L);
        });

        assertEquals("Usuário autenticado não encontrado.", exception.getMessage());

    }

    @DisplayName("Visualizar detalhes de perfil de um usuário que não é Empresa")
    @Test
    void viewProfileOfUserThatIsNotCompany() {
        User user = new User();
        user.setName("Profissional");
        user.setEnabled(true);
        user.setUf("CE");
        user.setCep("62320000");
        user.setCity("Tiangua");
        user.setEmail("profissional@email.com");
        user.setNeighborhood("teste");
        user.setStreet("teste");
        user.setHandle("@company");
        user.setPhoneNumber("88900000000");
        user.setPassword("senhasegura123");
        user.setType(UserType.COMPANY);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);
        userRepository.save(user);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        CompanyNotFoundException exception = assertThrows(CompanyNotFoundException.class, () -> {
            companyProfileService.getProfile(user.getId());
        });
        assertEquals("Empresa não encontrada.", exception.getMessage());
    }


    @DisplayName("Atualiza perfil com sucesso")
    @Test
    void updateProfileSucess() {
        Company loggedUser = createTestCompanyUser("Hertech", "hert@test.com", "@hertech", "Descrição teste", "Sobre nós");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        CompanyProfileRequestDTO request = new CompanyProfileRequestDTO(
                "Hertech Atualizado", "12.345.678/0001-99", CompanyType.NACIONAL, "88 99999999",
                "62320001", "teste", "teste", "test", "CE", "Descrição atualizada", "Sobre nós atualizado", "https://hertech.com"
        );

        CompanyProfileResponseDTO response = companyProfileService.updateMyProfile(request);

        assertNotNull(response);
        assertEquals("Hertech Atualizado", response.name());
        assertEquals(CompanyType.NACIONAL, response.companyType());
        assertEquals("88 99999999", response.phoneNumber());
        assertEquals("Tianguá", response.city());
        assertEquals("CE", response.uf());
        assertEquals("Descrição atualizada", response.description());
        assertEquals("Sobre nós atualizado", response.aboutUs());
        assertEquals("https://hertech.com", response.externalLink());
    }

    @DisplayName("Lança exceção quando descrição ultrapassar o máximo de 400 caracteres")
    @Test
    void descriptionMaxLengthValidation() {
        String longDescription = "a".repeat(401);
        Company loggedUser = createTestCompanyUser("Hertech", "hert@test.com", "@hertech", "Descrição teste", "Sobre nós");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        CompanyProfileRequestDTO request = new CompanyProfileRequestDTO(
                "Hertech Atualizado", "12.345.678/0001-99", CompanyType.NACIONAL, "88 99999999",
                "62320001", "teste", "teste", "test", "CE",
                longDescription, "Sobre atualizado", "https://hertech.com"
        );

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            companyProfileService.updateMyProfile(request);
        });

        assertEquals("description deve ter no máximo 400 caracteres.", exception.getMessage());


    }

    @DisplayName("Deve Lança exceção quando aboutUs excede 1000 caracteres")
    @Test
    void updateProfileAboutUsTooLong_throwsValidationException() {
        String longAboutUs = "a".repeat(1001);

        Company loggedUser = createTestCompanyUser("Hertech", "hert@test.com", "@hertech", "Descrição teste", "Sobre nós");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        CompanyProfileRequestDTO request = new CompanyProfileRequestDTO(
                "Hertech Atualizado", "12.345.678/0001-99", CompanyType.NACIONAL, "88 99999999",
                "62320001", "teste", "teste", "test", "CE",
                "Descrição válida", longAboutUs, "https://hertech.com"
        );

        ValidationException exception = assertThrows(ValidationException.class,
                () -> companyProfileService.updateMyProfile(request)
        );

        assertEquals("aboutUs deve ter no máximo 1000 caracteres.", exception.getMessage());


    }


    @DisplayName("Deve lança exceção quando Link ultrapassar 100 caracteres")
    @Test
    void externalLinkMustHave100Characters() {
        String externalLink = "a".repeat(101);
        Company loggedUser = createTestCompanyUser("Hertech", "hert@test.com", "@hertech", "Descrição teste", "Sobre nós");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);


        CompanyProfileRequestDTO request = new CompanyProfileRequestDTO(
                "Hertech Atualizado", "12.345.678/0001-99", CompanyType.NACIONAL, "88 99999999",
                "62320001", "teste", "teste", "test", "CE",
                "Descrição válida", "Sobre nós válido",externalLink
        );


        ValidationException ex = assertThrows(
                ValidationException.class,
                () -> companyProfileService.updateMyProfile(request)
        );

        assertEquals("externalLink deve ter no máximo 100 caracteres.", ex.getMessage());
    }

    @DisplayName("Deve lançar exceção quando external Link não começar com http ou https")
    @Test
    void shouldThrowExceptionWhenExternalLinkDoesNotStartWithHttpOrHttps() {
        String externalLink = "ftp://site.com";

        Company loggedUser = createTestCompanyUser(
                "Hertech", "hertech@teste.com", "@hertech", "Descrição de teste", "Sobre nós"
        );

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        CompanyProfileRequestDTO request = new CompanyProfileRequestDTO(
                "Hertech Atualizado", "12.345.678/0001-99", CompanyType.NACIONAL, "88 99999999",
                "62320001", "teste", "teste", "test", "CE",
                "Descrição válida", "Sobre nós válido", externalLink
        );

        ValidationException ex = assertThrows(
                ValidationException.class,
                () -> companyProfileService.updateMyProfile(request)
        );

        assertEquals("externalLink deve começar com http ou https.", ex.getMessage());

    }


    @DisplayName("Deve lançar exceção para external Link inválido")
    @Test
    void externalLinkInvalid() {
        Company loggedUser = createTestCompanyUser("Hertech", "hert@test.com", "@hertech", "Descrição teste", "Sobre nós");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        CompanyProfileRequestDTO request = new CompanyProfileRequestDTO(
                "Hertech Atualizado", "12.345.678/0001-99", CompanyType.NACIONAL, "88 99999999",
                "62320001", "teste", "teste", "test", "CE",
                "Descrição válida", "Sobre nós válido", "ht!tp://inválido"
        );

        ValidationException ex = assertThrows(
                ValidationException.class,
                () -> companyProfileService.updateMyProfile(request)
        );
        assertEquals("externalLink não é uma URL válida.", ex.getMessage());
    }


    @DisplayName("Visualizar detalhes pessoais do perfil")
    @Test
    void viewPersonalDetails(){

        User user = new User();
        user.setName("HerTech");
        user.setEnabled(true);
        user.setUf("CE");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setEmail("Hertech@email.com");
        user.setNeighborhood("Centro");
        user.setStreet("Avenida Prefeito Jacques Nunes");
        user.setHandle("@hertech");
        user.setPhoneNumber("88900000000");
        user.setPassword("senhasegura123");
        user.setType(UserType.COMPANY);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("COMPANY")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);

        Company company= new Company();
        company.setUser(user);
        company.setCnpj("12.345.678/0001-99");
        company.setDescription("Descrição Teste");
        company.setAboutUs("Sobre nós");


        companyRepository.save(company);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        MyCompanyProfileResponseDTO response = companyProfileService.getMyProfile();

        assertNotNull(response);

        assertEquals("HerTech", response.name());
        assertEquals("62320000", response.cep());
        assertEquals("Centro", response.neighborhood());
        assertEquals("Tianguá", response.city());
        assertEquals("Avenida Prefeito Jacques Nunes", response.street());
        assertEquals("CE", response.uf());
        assertEquals("Hertech@email.com", response.email());
        assertEquals("88900000000", response.phoneNumber());
        assertEquals("12.345.678/0001-99", response.cnpj());
        assertEquals("Descrição Teste", response.description());
        assertEquals("Sobre nós", response.aboutUs());
    }

}