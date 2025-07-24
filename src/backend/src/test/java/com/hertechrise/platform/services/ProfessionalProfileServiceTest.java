package com.hertechrise.platform.services;

import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.data.dto.request.ExperienceRequestDTO;
import com.hertechrise.platform.data.dto.request.ProfessionalProfileRequestDTO;
import com.hertechrise.platform.data.dto.response.MyProfessionalProfileResponseDTO;
import com.hertechrise.platform.data.dto.response.ProfessionalProfileResponseDTO;
import com.hertechrise.platform.exception.InvalidUserTypeException;
import com.hertechrise.platform.exception.ProfessionalNotFoundException;
import com.hertechrise.platform.exception.UserNotFoundException;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.*;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback
@ContextConfiguration(initializers = {DotenvInitializer.class})
class ProfessionalProfileServiceTest extends AbstractIntegrationTest {
    @Autowired
    private ProfessionalRepository professionalRepository;
    @Autowired
    private ProfessionalProfileService professionalProfileService;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private FollowRelationshipRepository followRelationshipRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ExperienceRepository experienceRepository;

    private Professional createTestProfessioanal(String name, String email, String technology, String biografy, String handle) {
        User user = new User();
        user.setName(name);
        user.setEnabled(true);
        user.setUf("CE");
        user.setCep("62320000");
        user.setCity("Tiangua");
        user.setEmail(email);
        user.setNeighborhood("teste");
        user.setStreet("teste");
        user.setHandle(handle);
        user.setPhoneNumber("88900000000");
        user.setPassword("senhasegura123");
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);

        Professional professional = new Professional();
        professional.setCpf(String.format("%011d", new Random().nextLong() % 1_000_000_00000L));
        professional.setBirthDate(LocalDate.of(1998, 7, 23));
        professional.setTechnology(technology);
        professional.setBiography(biografy);
        professional.setUser(user);
        professionalRepository.save(professional);

        return professional;
    }

    @DisplayName("Visualizar detalhes de outro profissional a partir do ID")
    @Test
    void viewOtherProfessionalProfile(){
        Professional professional = createTestProfessioanal("Midian Lima", "midian@email.com",
                "Spring Boot", "Sou a Midian", "@midian");

        Post post_1 = new Post();
        post_1.setAuthor(professional.getUser());
        post_1.setContent("Olá mundo!");
        post_1.setCreatedAt(LocalDateTime.now());
        post_1.setVisibility(PostVisibility.PUBLICO);
        postRepository.save(post_1);

        Post post_2 = new Post();
        post_2.setAuthor(professional.getUser());
        post_2.setContent("Olá mundo!");
        post_2.setCreatedAt(LocalDateTime.now());
        post_2.setVisibility(PostVisibility.PRIVADO);
        postRepository.save(post_2);

        Professional loggedProfessioanal = createTestProfessioanal("User", "user@email.com",
                "Tecnologia", "Biografia", "@teste");
        FollowRelationship followRelationship = new FollowRelationship();
        followRelationship.setFollower(loggedProfessioanal.getUser());
        followRelationship.setFollowing(professional.getUser());
        followRelationshipRepository.save(followRelationship);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedProfessioanal.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        ProfessionalProfileResponseDTO result = professionalProfileService.getProfile(professional.getUser().getId());

        assertNotNull(result);
        assertEquals("Midian Lima", result.name());
        assertEquals("midian@email.com", result.email());
        assertEquals("Spring Boot", result.technology());
        assertEquals("Sou a Midian", result.biography());
        assertEquals("@midian", result.handle());
        assertEquals(1, result.followersCount());
        assertEquals(0, result.experiences().size());
        assertEquals(1, result.posts().size());
    }

    @DisplayName("Visualizar detalhes do próprio perfil")
    @Test
    void viewOwnProfessionalProfile(){
        Professional professional = createTestProfessioanal("Midian Lima", "midian@email.com",
                "Spring Boot", "Sou a Midian", "@midian");

        Post post_1 = new Post();
        post_1.setAuthor(professional.getUser());
        post_1.setContent("Olá mundo!");
        post_1.setCreatedAt(LocalDateTime.now());
        post_1.setVisibility(PostVisibility.PUBLICO);
        postRepository.save(post_1);

        Post post_2 = new Post();
        post_2.setAuthor(professional.getUser());
        post_2.setContent("Olá mundo!");
        post_2.setCreatedAt(LocalDateTime.now());
        post_2.setVisibility(PostVisibility.PRIVADO);
        postRepository.save(post_2);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        ProfessionalProfileResponseDTO result = professionalProfileService.getProfile(professional.getUser().getId());

        assertNotNull(result);
        assertEquals("Midian Lima", result.name());
        assertEquals("midian@email.com", result.email());
        assertEquals(0, result.followersCount());
        assertEquals(0, result.experiences().size());
        assertEquals(2, result.posts().size());
    }

    @DisplayName("Visualizar detalhes de perfil com ID de usuário não existe")
    @Test
    void viewProfileOfUserThatDoesNotExist(){
        Professional loggedProfessional = createTestProfessioanal("User", "user@email.com",
                "Tecnologia", "Biografia", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedProfessional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            professionalProfileService.getProfile(10L);
        });
        assertEquals("Usuário autenticado não encontrado.", exception.getMessage());
    }

    @DisplayName("Visualizar detalhes de perfil de um usuário que não é profissional")
    @Test
    void viewProfileOfUserThatIsNotProfessional(){
        User user = new User();
        user.setName("Empresa");
        user.setEnabled(true);
        user.setUf("CE");
        user.setCep("62320000");
        user.setCity("Tiangua");
        user.setEmail("company@email.com");
        user.setNeighborhood("teste");
        user.setStreet("teste");
        user.setHandle("@company");
        user.setPhoneNumber("88900000000");
        user.setPassword("senhasegura123");
        user.setType(UserType.COMPANY);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("COMPANY")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);
        userRepository.save(user);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        ProfessionalNotFoundException exception = assertThrows(ProfessionalNotFoundException.class, () -> {
            professionalProfileService.getProfile(user.getId());
        });
        assertEquals("Profissional não encontrado", exception.getMessage());
    }

    @DisplayName("Atualiza perfil com sucesso")
    @Test
    void updateProfile(){
        Professional professional = createTestProfessioanal("Midian Lima", "midian@email.com",
                "Spring Boot", "Sou a Midian", "@midian");

        Experience exp = new Experience();
        exp.setProfessional(professional);
        exp.setCompany("Prefeitura");
        exp.setModality("Presencial");
        exp.setCurrent(false);
        exp.setStartDate(LocalDate.of(2019, 6, 30));
        exp.setEndDate(LocalDate.of(2020, 5, 1));
        exp.setTitle("Assistente Admistrativo");
        exp.setDescription("Assistente na prefeitura");
        professional.getExperiences().add(exp);
        experienceRepository.save(exp);

        List<ExperienceRequestDTO> experiences = new ArrayList<>();
        experiences.add(new ExperienceRequestDTO(
                exp.getId(), exp.getTitle(), exp.getCompany(), exp.getModality(), exp.getStartDate(), exp.getEndDate(),
                exp.isCurrent(), exp.getDescription()
        ));
        experiences.add(new ExperienceRequestDTO(
                null, "Desenvolvedor Java", "Tech Solutions", "Presencial",
                LocalDate.of(2018, 1, 1),
                LocalDate.of(2022, 6, 30), false,
                "Desenvolvimento de sistemas bancários e automação de processos."
        ));
        experiences.add(new ExperienceRequestDTO(
                null, "Engenheira de Software", "InovaTech", "Remoto",
                LocalDate.of(2023, 5, 1), null, true,
                "Trabalho com arquitetura de microsserviços e DevOps."
        ));
        ProfessionalProfileRequestDTO request = new ProfessionalProfileRequestDTO("Rafaela Silva", "01234567890",
                LocalDate.of(2004, 11, 2), "88993042194", "rafaela@email.com",
                "62320000", "Forum", "Rua Paturi", "CE", "React", "Sou a Rafa",
                experiences, "https://google.com");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        ProfessionalProfileResponseDTO response = professionalProfileService.updateMyProfile(request);

        assertNotNull(response);
        assertEquals("Rafaela Silva", response.name());
        assertEquals("rafaela@email.com", response.email());
        assertEquals("React", response.technology());
        assertEquals("Sou a Rafa", response.biography());
        assertEquals("@midian", response.handle());
        assertEquals(3, response.experiences().size());
        assertEquals("Engenheira de Software", response.experiences().getFirst().title());
        assertEquals("Assistente Admistrativo", response.experiences().get(1).title());
        assertEquals("Desenvolvedor Java", response.experiences().get(2).title());
    }

    @DisplayName("Tecnologia deve ter até 80 caracteres")
    @Test
    void technologyMustHave80Characters(){
        String technology = "a".repeat(81);

        ProfessionalProfileRequestDTO request = new ProfessionalProfileRequestDTO(
                "Nome", "12345678900", LocalDate.of(2000, 1, 1),
                "88999999999", "email@email.com", "62000000", "Bairro",
                "Rua", "CE", technology, "Bio", List.of(), null
        );

        Professional loggedProfessional = createTestProfessioanal("User", "user@email.com",
                "Tecnologia", "Biografia", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedProfessional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            professionalProfileService.updateMyProfile(request);
        });
        assertEquals("technology deve ter no máximo 80 caracteres.", exception.getMessage());
    }

    @DisplayName("Biografia deve ter até 1000 caracteres")
    @Test
    void biografyMustHave80Characters(){
        String biografy = "a".repeat(1001);

        ProfessionalProfileRequestDTO request = new ProfessionalProfileRequestDTO(
                "Nome", "12345678900", LocalDate.of(2000, 1, 1),
                "88999999999", "email@email.com", "62000000", "Bairro",
                "Rua", "CE", "Tech", biografy, List.of(), null
        );

        Professional loggedProfessional = createTestProfessioanal("User", "user@email.com",
                "Tecnologia", "Biografia", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedProfessional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            professionalProfileService.updateMyProfile(request);
        });
        assertEquals("biography deve ter no máximo 1000 caracteres.", exception.getMessage());
    }

    @DisplayName("Usuário pode cadastrar no máximo 20 experiências")
    @Test
    void maximumOf20Experiences(){
        ExperienceRequestDTO baseExperience = new ExperienceRequestDTO(
                null, "Desenvolvedor Java", "Tech Solutions", "Presencial",
                LocalDate.of(2018, 1, 1),
                LocalDate.of(2022, 6, 30), false,
                "Desenvolvimento de sistemas bancários e automação de processos."
        );
        List<ExperienceRequestDTO> experiences = new ArrayList<>();
        for (int i = 0; i < 21; i++) experiences.add(baseExperience);

        ProfessionalProfileRequestDTO request = new ProfessionalProfileRequestDTO(
                "Nome", "12345678900", LocalDate.of(2000, 1, 1),
                "88999999999", "email@email.com", "62000000", "Bairro",
                "Rua", "CE", "Tech", "Bio", experiences, null
        );

        Professional loggedProfessional = createTestProfessioanal("User", "user@email.com",
                "Tecnologia", "Biografia", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedProfessional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            professionalProfileService.updateMyProfile(request);
        });
        assertEquals("Máximo de 20 experiências permitidas.", exception.getMessage());
    }

    @DisplayName("Link externo deve ter no máximo 100 caracteres")
    @Test
    void externalLinkMustHave100Characters(){
        String externalLink = "a".repeat(101);

        ProfessionalProfileRequestDTO request = new ProfessionalProfileRequestDTO(
                "Nome", "12345678900", LocalDate.of(2000, 1, 1),
                "88999999999", "email@email.com", "62000000", "Bairro",
                "Rua", "CE", "Tech", "Bio", List.of(), externalLink
        );

        Professional loggedProfessional = createTestProfessioanal("User", "user@email.com",
                "Tecnologia", "Biografia", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedProfessional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            professionalProfileService.updateMyProfile(request);
        });
        assertEquals("externalLink deve ter no máximo 100 caracteres.", exception.getMessage());
    }

    @DisplayName("Link externo deve começar com http ou https")
    @Test
    void externalLinkMustStartWithHttpOrHttps(){
        String externalLink = "google.com";

        ProfessionalProfileRequestDTO request = new ProfessionalProfileRequestDTO(
                "Nome", "12345678900", LocalDate.of(2000, 1, 1),
                "88999999999", "email@email.com", "62000000", "Bairro",
                "Rua", "CE", "Tech", "Bio", List.of(), externalLink
        );

        Professional loggedProfessional = createTestProfessioanal("User", "user@email.com",
                "Tecnologia", "Biografia", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedProfessional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            professionalProfileService.updateMyProfile(request);
        });
        assertEquals("externalLink deve começar com http ou https.", exception.getMessage());
    }

    @DisplayName("Link externo deve estar formado corretamente")
    @Test
    void externalLinkMustBeWellFormed(){
        String externalLink = "htp:/google .com";

        ProfessionalProfileRequestDTO request = new ProfessionalProfileRequestDTO(
                "Nome", "12345678900", LocalDate.of(2000, 1, 1),
                "88999999999", "email@email.com", "62000000", "Bairro",
                "Rua", "CE", "Tech", "Bio", List.of(), externalLink
        );

        Professional loggedProfessional = createTestProfessioanal("User", "user@email.com",
                "Tecnologia", "Biografia", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedProfessional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            professionalProfileService.updateMyProfile(request);
        });
        assertEquals("externalLink não é uma URL válida.", exception.getMessage());
    }

    @DisplayName("Visualizar detalhes pessoais do perfil")
    @Test
    void viewPersonalDetails(){
        User user = new User();
        user.setName("Midian Lima");
        user.setEnabled(true);
        user.setUf("CE");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setEmail("midian@email.com");
        user.setNeighborhood("Centro");
        user.setStreet("Avenida Prefeito Jacques Nunes");
        user.setHandle("@midian");
        user.setPhoneNumber("88900000000");
        user.setPassword("senhasegura123");
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);
        Professional professional = new Professional();
        professional.setUser(user);
        professional.setCpf("01234567890");
        professional.setBiography("Bio");
        professional.setTechnology("Tecnologia");
        professional.setBirthDate(LocalDate.of(2000, 1, 1));
        professionalRepository.save(professional);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
        MyProfessionalProfileResponseDTO response = professionalProfileService.getMyProfile();

        assertNotNull(response);
        assertEquals("Midian Lima", response.name());
        assertEquals("midian@email.com", response.email());
        assertEquals("01234567890", response.cpf());
        assertEquals(LocalDate.of(2000, 1, 1), response.birthDate());
        assertEquals("88900000000", response.phoneNumber());
        assertEquals("62320000", response.cep());
        assertEquals("Centro", response.neighborhood());
        assertEquals("Avenida Prefeito Jacques Nunes", response.street());
    }
}