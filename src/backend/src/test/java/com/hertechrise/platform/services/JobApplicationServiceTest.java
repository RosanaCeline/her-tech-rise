package com.hertechrise.platform.services;
import com.hertechrise.platform.exception.AlreadyCandidateException;
import com.hertechrise.platform.repository.JobPostingRepository;
import com.hertechrise.platform.model.JobApplication;
import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.data.dto.request.JobApplicationRequestDTO;
import com.hertechrise.platform.exception.InvalidUserTypeException;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.*;
import jakarta.persistence.EntityManager;
import com.hertechrise.platform.data.dto.response.*;
import com.hertechrise.platform.model.JobPosting;
import com.hertechrise.platform.model.Professional;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.repository.JobApplicationRepository;
import com.hertechrise.platform.repository.ProfessionalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

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
    @Autowired
    private JobApplicationService jobApplicationService;

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

    @SneakyThrows
    @DisplayName("Deve permitir que o usuário Profissional logado se candidate a um vaga ")
    @Test
    void applyToJobSuccess() {
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

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

        Professional professional = createTestProfessioanal("Cláudia ", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFile = new MockMultipartFile(
                "resume",
                "curriculoTest.pdf",
                "application/pdf",
                inputStream
        );
        // Criar DTO de requisição
        JobApplicationRequestDTO applicationRequest = new JobApplicationRequestDTO(
                job.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFile
        );

        CandidateApplicationDetailsResponseDTO response = jobApplicationService.applyToJob(applicationRequest);
        assertNotNull(response);
        assertEquals("Programador Júnior", response.jobTitle());
        assertTrue(response.resumeUrl().contains("cloudinary.com"));

        List<JobApplication> apps = jobApplicationRepository.findAll();
        assertEquals(1, apps.size());

        JobApplication savedApp = apps.get(0);
        assertEquals(job.getId(), savedApp.getJobPosting().getId());
        assertEquals(professional.getUserId(), savedApp.getProfessional().getUserId());
    }
    @SneakyThrows
    @DisplayName("Deve lançar EntityNotFoundException ao tentar se candidatar em uma vaga não encontrada")
    @Test
    void applyToJobSuccessThrowEntityNotFoundException(){
        Professional professional = createTestProfessioanal("Cláudia ", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);


        InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFile = new MockMultipartFile(
                "resume",
                "curriculoTest.pdf",
                "application/pdf",
                inputStream
        );
        JobApplicationRequestDTO applicationRequest = new JobApplicationRequestDTO(
                999L,
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFile
        );
        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> jobApplicationService.applyToJob(applicationRequest) );

        assertEquals("Vaga não encontrada.", exception.getMessage());

    }
    @SneakyThrows
    @DisplayName("Deve lançar EntityNotFoundException para quando usuário que se candidatou não é profissional")
    @Test
    void applyToJob_ShouldThrowExceptionNotProfessional(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

        InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFile = new MockMultipartFile(
                "resume",
                "curriculoTest.pdf",
                "application/pdf",
                inputStream
        );

        JobApplicationRequestDTO applicationRequest = new JobApplicationRequestDTO(
                999L,
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFile
        );
        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> jobApplicationService.applyToJob(applicationRequest)
        );
        assertEquals("Usuário logado não é um profissional.", exception.getMessage());

    }
    @SneakyThrows
    @DisplayName("Deve lançar AlreadyCandidateException quando o profissional tentar se candidatar a uma vaga novamente")
    @Test
    void applyToJobThrowsAlreadyCandidateException() {

        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

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

        Professional professional = createTestProfessioanal("Cláudia ", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFile = new MockMultipartFile(
                "resume",
                "curriculoTest.pdf",
                "application/pdf",
                inputStream
        );
        // Criar DTO de requisição
        JobApplicationRequestDTO applicationRequest = new JobApplicationRequestDTO(
                job.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFile
        );

        jobApplicationService.applyToJob(applicationRequest);
        AlreadyCandidateException exception = assertThrows(
                AlreadyCandidateException.class,
                () -> jobApplicationService.applyToJob(applicationRequest)
        );
        assertEquals("Você já se candidatou a esta vaga.", exception.getMessage());

    }
    @SneakyThrows
    @DisplayName("Deve retornar detalhes da candidatura do profissional logado ")
    @Test
    void getMyApplicationDetailsSuccess()  {
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

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

        Professional professional = createTestProfessioanal("Cláudia ", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFile = new MockMultipartFile(
                "resume",
                "curriculoTest.pdf",
                "application/pdf",
                inputStream
        );
        JobApplicationRequestDTO applicationRequest = new JobApplicationRequestDTO(
                job.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFile
        );
        CandidateApplicationDetailsResponseDTO applicationResponse = jobApplicationService.applyToJob(applicationRequest);


        CandidateApplicationDetailsResponseDTO response = jobApplicationService.getMyApplicationDetails(applicationResponse.applicationId());

        assertNotNull(response);
        assertEquals(applicationResponse.applicationId(), response.applicationId());
        assertEquals(professional.getUserId(), response.applicantId());
        assertEquals("Cláudia ", response.applicantName());
        assertEquals("Spring Boot", response.applicantTechnology());
        assertEquals("88900000000", response.applicantPhone());
        assertEquals("claudia@email.com", response.applicantEmail());
        assertNotNull(response.applicantProfilePic());
        assertTrue(response.resumeUrl().contains("cloudinary.com"));
        assertEquals("https://github.com/claudia-souza", response.githubLink());
        assertEquals("https://claudia.dev", response.portfolioLink());
        assertEquals("Programador Júnior", response.jobTitle());
        assertNotNull(response.appliedAt());
        assertEquals(job.getApplicationDeadline(), response.applicationDeadline());
        assertEquals(job.isActive(),true);
        assertEquals(job.isExpired(),false);
        assertEquals("HerTechRise", response.companyName());
        assertNotNull(response.companyProfilePic());
        assertEquals(company.getUserId(), response.companyUserId());
    }
    @DisplayName("Deve lançar EntityNotFoundException para detalhes de candidatura não existente ")
    @Test
    void getMyApplicationDetailsThrowEntityNotFoundException(){
        Professional professional = createTestProfessioanal("Cláudia ", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> jobApplicationService.getMyApplicationDetails(999L)
        );

        assertEquals("Candidatura não encontrada.", exception.getMessage());

    }
    @SneakyThrows
   @DisplayName("Deve lançar SecurityException detalhes de candidatura não autorizado")
   @Test
    void getMyApplicationDetailsThrowSecurityException(){

       Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
       UsernamePasswordAuthenticationToken auth1 =
               new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
       SecurityContextHolder.getContext().setAuthentication(auth1);

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

       Professional professional = createTestProfessioanal("Cláudia ", "claudia@email.com",
               "Spring Boot", "Biografia teste", "@claudia"

       );
       UsernamePasswordAuthenticationToken auth =
               new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
       SecurityContextHolder.getContext().setAuthentication(auth);

       InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
       MultipartFile multipartFile = new MockMultipartFile(
               "resume",
               "curriculoTest.pdf",
               "application/pdf",
               inputStream
       );
       JobApplicationRequestDTO applicationRequest = new JobApplicationRequestDTO(
               job.getId(),
               "https://github.com/claudia-souza",
               "https://claudia.dev",
               multipartFile
       );

       CandidateApplicationDetailsResponseDTO response = jobApplicationService.applyToJob(applicationRequest);

       Professional professional2 = createTestProfessioanal("Rosana ", "rosana@email.com",
               "Spring Boot", "Biografia teste", "@rosana"

       );
       UsernamePasswordAuthenticationToken auth2 =
               new UsernamePasswordAuthenticationToken(professional2.getUser(), null, List.of());
       SecurityContextHolder.getContext().setAuthentication(auth2);


       SecurityException exception = assertThrows(
               SecurityException.class,
               () -> jobApplicationService.getMyApplicationDetails(response.applicationId())
       );
       assertEquals("Você não tem permissão para ver essa candidatura.", exception.getMessage());
    }
    @SneakyThrows
    @DisplayName("Empresa deve ver os detalhes das candidaturas de sua vaga publicada")
    @Test
    void getReceivedApplicationDetailsSuccess() {
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

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
        Professional professional = createTestProfessioanal("Cláudia", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFile = new MockMultipartFile(
                "resume",
                "curriculoTest.pdf",
                "application/pdf",
                inputStream
        );
        JobApplicationRequestDTO applicationRequest = new JobApplicationRequestDTO(
                job.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFile
        );
        CandidateApplicationDetailsResponseDTO applicationResponse =
                jobApplicationService.applyToJob(applicationRequest);

        UsernamePasswordAuthenticationToken authCompany =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authCompany);

        ReceivedApplicationDetailsResponseDTO response =
                jobApplicationService.getReceivedApplicationDetails(applicationResponse.applicationId());

        assertNotNull(response);
        assertEquals(applicationResponse.applicationId(), response.applicationId());
        assertEquals(professional.getUserId(), response.applicantId());
        assertEquals("Cláudia", response.applicantName());
        assertEquals("Spring Boot", response.applicantTechnology());
        assertEquals("88900000000", response.applicantPhone());
        assertEquals("claudia@email.com", response.applicantEmail());
        assertEquals("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png",response.applicantProfilePic());
        assertEquals("Programador Júnior", response.jobTitle());
        assertNotNull(response.resumeUrl());
        assertEquals("https://github.com/claudia-souza", response.githubLink());
        assertEquals("https://claudia.dev", response.portfolioLink());
        assertNotNull(response.applicationDeadline());
        assertNotNull(response.appliedAt());
        assertEquals(response.isActive(),true);
        assertEquals(response.isExpired(),false);

    }
    @SneakyThrows
    @DisplayName("Deve lançar SecurityException para acesso não autorizado ao detalhes das vagas")
    @Test
    void getReceivedApplicationDetailsThrowsSecurityException()  {
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

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
        Professional professional = createTestProfessioanal("Cláudia", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFile = new MockMultipartFile(
                "resume",
                "curriculoTest.pdf",
                "application/pdf",
                inputStream
        );
        JobApplicationRequestDTO applicationRequest = new JobApplicationRequestDTO(
                job.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFile
        );
        CandidateApplicationDetailsResponseDTO applicationResponse =
                jobApplicationService.applyToJob(applicationRequest);

        Company otherComapny = createTestComapany("EmpresaX", "empresa@email.com", "@empresa");
        UsernamePasswordAuthenticationToken auth2 =
                new UsernamePasswordAuthenticationToken(otherComapny.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth2);


        SecurityException exception = assertThrows(
                SecurityException.class,
                () -> jobApplicationService.getReceivedApplicationDetails(applicationResponse.applicationId())
        );
        assertEquals("Você não tem permissão para ver essa candidatura.", exception.getMessage());
    }
    @DisplayName("Deve lançar EntityNotFoundException para candidatura não encontrada")
    @Test
    void getReceivedApplicationDetailsThrowsEntityNotFoundException(){

        Company company = createTestComapany("TechSolutions", "tech@email.com", "@tech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
        Long idCandidaturaInexistente = 999L;
        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> jobApplicationService.getReceivedApplicationDetails(idCandidaturaInexistente)
        );
        assertEquals("Candidatura não encontrada.", exception.getMessage());

    }
    @SneakyThrows
    @DisplayName("Deve listar todas as candidaturas de um profissional logado")
    @Test
    void listMyApplicationsSuccess() {

        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

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

        Company company2 = createTestComapany("EmpresaX", "empresa@email.com", "@empresa");
        UsernamePasswordAuthenticationToken auth3 =
                new UsernamePasswordAuthenticationToken(company2.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth3);

        JobPosting job2 = new JobPosting();
        job2.setCompany(company2);
        job2.setTitle("Programador Pleno");
        job2.setDescription("Vaga de programador");
        job2.setRequirements("React.js");
        job2.setLocation("Tianguá");
        job2.setJobModel(JobModel.PRESENCIAL);
        job2.setSalaryMin(BigDecimal.valueOf(2000));
        job2.setSalaryMax(BigDecimal.valueOf(2500));
        job2.setContractType(JobContractType.CLT);
        job2.setJoblevel(JobLevel.JUNIOR);
        job2.setApplicationDeadline(LocalDate.now().plusWeeks(2));
        jobPostingRepository.save(job2);

        Professional professional = createTestProfessioanal("Cláudia ", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFile = new MockMultipartFile(
                "resume",
                "curriculoTest.pdf",
                "application/pdf",
                inputStream
        );

        JobApplicationRequestDTO applicationRequest = new JobApplicationRequestDTO(
                job.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFile
        );
        CandidateApplicationDetailsResponseDTO response = jobApplicationService.applyToJob(applicationRequest);


        InputStream input = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFil = new MockMultipartFile(
                "resume",
                "curriculoTest.pdf",
                "application/pdf",
                input
        );

        JobApplicationRequestDTO applicationRequest2 = new JobApplicationRequestDTO(
                job2.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFil
        );

        CandidateApplicationDetailsResponseDTO response2 = jobApplicationService.applyToJob(applicationRequest2);

        List<CandidateApplicationSummaryResponseDTO> result =
                jobApplicationService.listMyApplications();
        assertTrue(result.stream().anyMatch(dto ->
                        dto.applicationId() != null &&
                                dto.jobId().equals(job.getId()) &&
                                dto.jobTitle().equals("Programador Júnior") &&
                                dto.appliedAt() != null &&
                                dto.applicationDeadline().equals(job.getApplicationDeadline()) &&
                                dto.isActive() &&
                                !dto.isExpired() &&
                                dto.companyName().equals("HerTechRise") &&
                                dto.companyProfilePic() != null &&
                                dto.companyUserId().equals(company.getUser().getId())
        ));

        assertTrue(result.stream().anyMatch(dto ->
                dto.applicationId() != null &&
                        dto.jobId().equals(job2.getId()) &&
                        dto.jobTitle().equals("Programador Pleno") &&
                        dto.appliedAt() != null &&
                        dto.applicationDeadline().equals(job2.getApplicationDeadline()) &&
                        dto.isActive() &&
                        !dto.isExpired() &&
                        dto.companyName().equals("EmpresaX") &&
                        dto.companyProfilePic() != null &&
                        dto.companyUserId().equals(company2.getUser().getId())
        ));
    }
    @DisplayName("Deve lançar EntityNotFoundException quando o usuário logado não for profissional tente listar as candidaturas realizadas")
    @Test
    void listMyApplicationsThrowsEntityNotFoundException(){

        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            jobApplicationService.listMyApplications();
        });

        assertEquals("Usuário logado não é um profissional.", exception.getMessage());

    }

    @SneakyThrows
    @DisplayName("Deve listar todas as candidaturas recebidas para uma vaga")
    @Test
    void listReceivedApplicationsByJob() {
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

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

        Professional professional = createTestProfessioanal("Cláudia", "claudia@email.com",
                "Java, Spring", "Bio", "@claudia");
        UsernamePasswordAuthenticationToken profAuth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(profAuth);

        MultipartFile cv = new MockMultipartFile(
                "resume", "cv.pdf", "application/pdf",
                getClass().getResourceAsStream("/curriculoTest.pdf")
        );

        JobApplicationRequestDTO dto = new JobApplicationRequestDTO(
                job.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                cv
        );
        CandidateApplicationDetailsResponseDTO response = jobApplicationService.applyToJob(dto);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        ReceivedApplicationsByJobResponseDTO receivedApplications =
                jobApplicationService.listReceivedApplicationsByJob(job.getId());


        assertNotNull(receivedApplications);
        assertEquals(job.getId(), receivedApplications.jobId());
        assertEquals("Programador Júnior", receivedApplications.jobTitle());
        assertEquals(job.getApplicationDeadline(), receivedApplications.applicationDeadline());
        assertTrue(receivedApplications.isActive());
        assertFalse(receivedApplications.isExpired());
        assertEquals(company.getUser().getName(), receivedApplications.companyName());
        assertNotNull(receivedApplications.companyProfilePic());
        assertEquals(1, receivedApplications.totalApplications());
        assertFalse(receivedApplications.applications().isEmpty());
        var applicationSummary = receivedApplications.applications().get(0);
        assertEquals(professional.getUserId(), applicationSummary.applicantId());
        assertEquals("Cláudia", applicationSummary.applicantName());
        assertEquals("Java, Spring", applicationSummary.applicantTechnology());
        assertEquals(professional.getUser().getPhoneNumber(), applicationSummary.applicantPhone());
        assertEquals(professional.getUser().getEmail(), applicationSummary.applicantEmail());
        assertNotNull(applicationSummary.applicantProfilePic());
        assertNotNull(applicationSummary.appliedAt());

    }
    @DisplayName("Deve lançar EntityNotFoundException ao listar uma vaga inexistente ")
    @Test
    void listReceivedApplicationsByJob_shouldThrowEntityNotFoundException(){

        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);
        Long idDeVagaInexistente = 9999L;

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> {
            jobApplicationService.listReceivedApplicationsByJob(idDeVagaInexistente);
        });

        assertEquals("Vaga não encontrada.", ex.getMessage());

    }
    @SneakyThrows
    @DisplayName("Deve lançar SecurityException para quando um usuário não autorizado tente listar as candidaturas recebidas")
    @Test
    void listReceivedApplicationsByJob_shouldThrowSecurityExceptio() {
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

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

        Professional professional = createTestProfessioanal("Cláudia", "claudia@email.com",
                "Java, Spring", "Bio", "@claudia");
        UsernamePasswordAuthenticationToken profAuth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(profAuth);

        MultipartFile cv = new MockMultipartFile(
                "resume", "cv.pdf", "application/pdf",
                getClass().getResourceAsStream("/curriculoTest.pdf")
        );

        JobApplicationRequestDTO dto = new JobApplicationRequestDTO(
                job.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                cv
        );
        CandidateApplicationDetailsResponseDTO response = jobApplicationService.applyToJob(dto);

        Company otherComapny = createTestComapany("EmpresaX", "empresa@email.com", "@empresa");
        UsernamePasswordAuthenticationToken auth2 =
                new UsernamePasswordAuthenticationToken(otherComapny.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth2);


        SecurityException exception = assertThrows(SecurityException.class, () -> {
            jobApplicationService.listReceivedApplicationsByJob(job.getId());
        });

        assertEquals("Você não tem permissão para visualizar candidaturas dessa vaga.", exception.getMessage());

    }
    @SneakyThrows
    @DisplayName("Deletar candidaturas com sucesso")
    @Test
    void deleteByIdSucess() {
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

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

        Professional professional = createTestProfessioanal("Cláudia ", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFile = new MockMultipartFile(
                "resume",
                "curriculoTest.pdf",
                "application/pdf",
                inputStream
        );

        JobApplicationRequestDTO applicationRequest = new JobApplicationRequestDTO(
                job.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFile
        );

        CandidateApplicationDetailsResponseDTO response = jobApplicationService.applyToJob(applicationRequest);

        jobApplicationService.deleteById(response.applicationId());

        JobApplication deletedApplication = jobApplicationRepository.findById(response.applicationId()).orElseThrow();
        assertTrue(deletedApplication.isDeleted());
    }
    @SneakyThrows
    @DisplayName("Deve lançar EntityNotFoundException ao tentar deletar candidatura inexistente")
    @Test
    void deleteById_shouldThrowWhenApplicationNotFound() {
        Professional professional = createTestProfessioanal("Cláudia ", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
                () -> jobApplicationService.deleteById(999L)
        );

        assertEquals("Candidatura não encontrada", exception.getMessage());

    }
    @SneakyThrows
    @DisplayName("Deve lançar SecurityException quando um usuário não autorizado tente deletar candidatura de um profissional")
    @Test
    void deleteById_shouldThrowWhenNotOwner() {


        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

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

        Professional professional = createTestProfessioanal("Cláudia ", "claudia@email.com",
                "Spring Boot", "Biografia teste", "@claudia"

        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(professional.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream inputStream = getClass().getResourceAsStream("/curriculoTest.pdf");
        MultipartFile multipartFile = new MockMultipartFile(
                "resume",
                "curriculoTest.pdf",
                "application/pdf",
                inputStream
        );

        JobApplicationRequestDTO applicationRequest = new JobApplicationRequestDTO(
                job.getId(),
                "https://github.com/claudia-souza",
                "https://claudia.dev",
                multipartFile
        );

        CandidateApplicationDetailsResponseDTO response = jobApplicationService.applyToJob(applicationRequest);

        Professional professional2 = createTestProfessioanal("Rosana ", "rosana@email.com",
                "Spring Boot", "Biografia teste", "@rosana"

        );
        UsernamePasswordAuthenticationToken auth2 =
                new UsernamePasswordAuthenticationToken(professional2.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth2);

        SecurityException exception = assertThrows(SecurityException.class,
                () -> jobApplicationService.deleteById(response.applicationId())
        );

        assertEquals("Você não tem permissão para deletar essa candidatura.", exception.getMessage());

    }

}