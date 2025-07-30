package com.hertechrise.platform.services;

import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.data.dto.request.JobApplicationRequestDTO;
import com.hertechrise.platform.data.dto.request.JobPostingRequestDTO;
import com.hertechrise.platform.exception.InvalidUserTypeException;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import com.hertechrise.platform.data.dto.request.JobApplicationRequestDTO;
import com.hertechrise.platform.data.dto.response.*;
import com.hertechrise.platform.model.JobApplication;
import com.hertechrise.platform.model.JobPosting;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@Transactional
@Rollback
@RequiredArgsConstructor
@ContextConfiguration(initializers = {DotenvInitializer.class})
class JobApplicationServiceTest extends AbstractIntegrationTest {
    @Autowired
    private JobPostingRepository jobPostingRepository;
    @Autowired
    private JobApplicationRepository jobApplicationRepository;
    @Autowired
    private ProfessionalRepository professionalRepository;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private JobPostingService jobPostingService;

    // criando : User/professional
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

    //criando empresa
    private Company createTestComapany(String name, String email, String handle) {
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
        user.setType(UserType.COMPANY);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("COMPANY")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);

        Company company = new Company();
        company.setCnpj(String.format("%014d", new Random().nextLong() % 1_000_000_00000000L));
        company.setCompanyType(CompanyType.NACIONAL);
        company.setUser(user);

        return companyRepository.save(company);
    }


    @DisplayName("Deve permitir que o usuário logado (profissional) se candidate a um vaga ")
    @Test
    void applyToJobSuccess() throws IOException {
        Professional professional = createTestProfessioanal("Cláudia ", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        // anuncio da vaga
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        JobPosting job = new JobPosting();
        job.setCompany(company);
        job.setTitle("Programador Júnior");
        job.setDescription("Vaga de programador");
        job.setRequirements("HTML e CSS");
        job.setLocation("Tianguá");
        job.setJobModel(JobModel.PRESENCIAL);
        job.setSalaryMin(BigDecimal.valueOf(2000));
        job.setSalaryMax(BigDecimal.valueOf(2500));
        job.setContractType(JobContractType.CLT);
        job.setJoblevel(JobLevel.JUNIOR);
        job.setApplicationDeadline(LocalDate.now().plusWeeks(2));
        jobPostingRepository.save(job);

        InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFile = new MockMultipartFile(
                "file",
                "curriculoTest.pdf",
                "arquivo/pdf",
                inputStream
        );
        // Criar DTO de requisição
        JobApplicationRequestDTO request = new JobApplicationRequestDTO(
                job.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFile,
                professional.getUser().getEmail(),
                professional.getUser().getPhoneNumber()
        );
        CandidateApplicationDetailsResponseDTO response = jobPostingService.applyToJob(request);

    }

    @Test
    void getMyApplicationDetails() {
    }

    @Test
    void getReceivedApplicationDetails() {
    }

    @Test
    void listMyApplications() {
    }

    @Test
    void listReceivedApplicationsByJob() {
    }

    @Test
    void deleteById() {
    }
}