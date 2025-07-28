package com.hertechrise.platform.services;
import com.hertechrise.platform.data.dto.request.ExperienceRequestDTO;
import com.hertechrise.platform.data.dto.request.ProfessionalProfileRequestDTO;
import com.hertechrise.platform.exception.InvalidUserTypeException;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.ExperienceRepository;
import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.repository.ProfessionalRepository;
import com.hertechrise.platform.repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import com.hertechrise.platform.model.Experience;
import com.hertechrise.platform.model.Professional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.ContextConfiguration;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import com.hertechrise.platform.repository.*;

@SpringBootTest
@Transactional
@ContextConfiguration(initializers = DotenvInitializer.class)
class ExperienceServiceTest extends AbstractIntegrationTest {

    @Autowired
    private ExperienceService experienceService;

    @Autowired
    private ProfessionalRepository professionalRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    // criando Profissional
    private Professional createTestProfessional(String name, String email, String technology, String biography, String handle) {
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
        professional.setBiography(biography);
        professional.setUser(user);
        return professionalRepository.save(professional);
    }

    @DisplayName("Deve adicionar uma nova experiência")
    @Test
    void toExperience() {
        Professional professional = createTestProfessional("Midian Lima", "midian@email.com",
                "Spring Boot", "Sou a Midian", "@midian");

        ExperienceRequestDTO dto = new ExperienceRequestDTO(
                null, "Desenvolvedora", "HerTech", "Remoto",
                LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1),
                false, "Desenvolvimento backend em Java"
        );

        experienceService.syncExperiences(professional, List.of(dto));

        assertThat(professional.getExperiences()).hasSize(1);
        Experience saved = professional.getExperiences().get(0);
        assertThat(saved.getTitle()).isEqualTo("Desenvolvedora");
        assertThat(saved.getCompany()).isEqualTo("HerTech");
        assertThat(saved.getProfessional()).isEqualTo(professional);
    }

    @DisplayName("Deve atualizar uma experiência existente")
    @Test
    void shouldUpdateExistingExperience() {
        Professional professional = createTestProfessional("Cláudia Souza", "claudia@email.com",
                "Java", "Dev claudia", "@claudia");

        Experience exp = new Experience();
        exp.setTitle("Dev Jr");
        exp.setCompany("Empresa teste");
        exp.setProfessional(professional);
        exp.setModality("Presencial");
        exp.setCurrent(false);
        exp.setStartDate(LocalDate.of(2019, 6, 30));
        exp.setEndDate(LocalDate.of(2020, 5, 1));
        exp.setDescription("Descrição teste");
        professional.getExperiences().add(exp);
        professional = professionalRepository.save(professional);

        ExperienceRequestDTO dto = new ExperienceRequestDTO(
                professional.getExperiences().get(0).getId(),
                "Senior Dev", "HerTech", "Remoto",
                LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1),
                true, "Nova descrição teste"
        );

        experienceService.syncExperiences(professional, List.of(dto));

        assertThat(professional.getExperiences()).hasSize(1);
        Experience updated = professional.getExperiences().get(0);
        assertThat(updated.getTitle()).isEqualTo("Senior Dev");
        assertThat(updated.isCurrent()).isTrue();
        assertThat(updated.getDescription()).isEqualTo("Nova descrição teste");
    }

    @DisplayName("Deve remover experiências não enviadas na Lista DTO")
    @Test
    void shouldRemoveUnlistedExperience() {
        Professional professional = createTestProfessional("Lais Coutinho", "lais@email.com",
                "React", "Biografia teste", "@lais");

        Experience experience = new Experience();
        experience.setTitle("teste");
        experience.setCompany("Empresa teste");
        experience.setModality("Presencial");
        experience.setStartDate(LocalDate.of(2020, 1, 1));
        experience.setEndDate(LocalDate.of(2021, 1, 1));
        experience.setCurrent(false);
        experience.setDescription("Descrição teste");
        experience.setProfessional(professional);

        professional.getExperiences().add(experience);
        professionalRepository.save(professional);

        experienceService.syncExperiences(professional, List.of());

        professional = professionalRepository.findById(professional.getUserId()).orElseThrow();
        assertThat(professional.getExperiences()).isEmpty();
    }

    @DisplayName("Deve manter experiência listada e remover não listadas")
    @Test
    void ConverterDTOEmEntidadeExperience() {
        Professional professional = createTestProfessional("Yasmin Rocha", "yasmin@email.com",
                "React", "Sou a Yasmin", "@yasmin");

        Experience exp1 = new Experience();
        exp1.setTitle("Cargo 1");
        exp1.setCompany("Empresa A");
        exp1.setProfessional(professional);
        exp1.setModality("Presencial");
        exp1.setCurrent(false);
        exp1.setStartDate(LocalDate.of(2019, 6, 30));
        exp1.setEndDate(LocalDate.of(2020, 5, 1));
        exp1.setDescription("Descrição 1");

        Experience exp2 = new Experience();
        exp2.setTitle("Cargo 2");
        exp2.setCompany("Empresa teste");
        exp2.setProfessional(professional);
        exp2.setModality("Presencial");
        exp2.setCurrent(false);
        exp2.setStartDate(LocalDate.of(2019, 6, 30));
        exp2.setEndDate(LocalDate.of(2020, 5, 1));
        exp2.setDescription("Descrição teste");

        professional.getExperiences().add(exp1);
        professional.getExperiences().add(exp2);
        professional = professionalRepository.save(professional);

        List<ExperienceRequestDTO> incoming = List.of(
                new ExperienceRequestDTO(
                        professional.getExperiences().get(0).getId(),
                        "Cargo teste atualizado",
                        "Empresa teste",
                        "Remoto",
                        LocalDate.of(2020, 1, 1),
                        LocalDate.of(2021, 1, 1),
                        false,
                        "Descrição atualizada"
                )
        );

        experienceService.syncExperiences(professional, incoming);

        professional = professionalRepository.findById(professional.getUserId()).orElseThrow();
        List<Experience> experiences = professional.getExperiences();

        assertThat(experiences).hasSize(1);
        assertThat(experiences.get(0).getTitle()).isEqualTo("Cargo teste atualizado");
    }

    @DisplayName("Deve atualizar e adicionar experiências simultaneamente")
    @Test
    void copyExperienceFields() {
        Professional professional = createTestProfessional("Yasmin Rocha", "yasmin@email.com",
                "React", "Sou a Yasmin", "@yasmin");

        Experience experience = new Experience();
        experience.setTitle("teste");
        experience.setCompany("hertech");
        experience.setModality("Presencial");
        experience.setStartDate(LocalDate.of(2019, 1, 1));
        experience.setEndDate(LocalDate.of(2020, 1, 1));
        experience.setCurrent(false);
        experience.setDescription("Antiga descrição");
        experience.setProfessional(professional);
        professional.getExperiences().add(experience);
        professional = professionalRepository.save(professional);
        ExperienceRequestDTO update = new ExperienceRequestDTO(
                professional.getExperiences().get(0).getId(),
                "Atualizado", "Nova Empresa teste", "Remoto",
                LocalDate.of(2020, 1, 1), LocalDate.of(2021, 1, 1),
                false, "Nova descrição teste "
        );
        ExperienceRequestDTO dto = new ExperienceRequestDTO(
                null, "Nova Experiencia", "Outra Empresa teste", "Remoto",
                LocalDate.of(2022, 2, 1), LocalDate.of(2023, 3, 1),
                false, "Descrição nova"
        );

        experienceService.syncExperiences(professional, List.of(update, dto));

        professional = professionalRepository.findById(professional.getUserId()).orElseThrow();
        assertThat(professional.getExperiences()).hasSize(2);
        assertThat(professional.getExperiences())
                .anyMatch(exp -> "Atualizado".equals(exp.getTitle()))
                .anyMatch(exp -> "Nova Experiencia".equals(exp.getTitle()));
    }

    @DisplayName("Deve adicionar várias experiências novas")
    @Test
    void addNewExperience() {
        Professional professional = createTestProfessional("Yasmin Rocha", "yasmin@email.com",
                "React", "Sou a Yasmin", "@yasmin");

        List<ExperienceRequestDTO> newExperiences = List.of(
                new ExperienceRequestDTO(null, "Cargo1 teste", "Empresa1 teste", "Remoto",
                        LocalDate.of(2021, 1, 1), LocalDate.of(2021, 12, 31), false, "Desc A"),
                new ExperienceRequestDTO(null, "Cargo2 teste", "Empresa2 teste", "Presencial",
                        LocalDate.of(2022, 1, 1), null, true, "Descrição")
        );

        experienceService.syncExperiences(professional, newExperiences);

        professional = professionalRepository.findById(professional.getUserId()).orElseThrow();
        assertThat(professional.getExperiences()).hasSize(2);
        assertThat(professional.getExperiences())
                .extracting(Experience::getTitle)
                .containsExactly("Cargo1 teste", "Cargo2 teste");
    }
}