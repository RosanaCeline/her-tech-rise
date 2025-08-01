package com.hertechrise.platform.services;

import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.data.dto.request.JobPostingRequestDTO;
import com.hertechrise.platform.data.dto.response.JobPostingResponseDTO;
import com.hertechrise.platform.data.dto.response.JobPostingSummaryResponseDTO;
import com.hertechrise.platform.data.dto.response.PublicJobPostingResponseDTO;
import com.hertechrise.platform.exception.InvalidUserTypeException;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.CompanyRepository;
import com.hertechrise.platform.repository.JobPostingRepository;
import com.hertechrise.platform.repository.RoleRepository;
import com.hertechrise.platform.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback
@ContextConfiguration(initializers = {DotenvInitializer.class})
class JobPostingServiceTest extends AbstractIntegrationTest {
    @Autowired
    private JobPostingService jobPostingService;
    @Autowired
    private JobPostingRepository jobPostingRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CompanyRepository companyRepository;

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

    @DisplayName("Cria vaga de emprego com sucesso")
    @Test
    void createJobPosting(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        JobPostingRequestDTO request = new JobPostingRequestDTO(
                "Programador Júnior", "Vaga de programador", "HTML e CSS",
                "Tianguá", JobModel.PRESENCIAL, BigDecimal.valueOf(2000), BigDecimal.valueOf(2500),
                JobContractType.CLT, JobLevel.JUNIOR, LocalDate.now().plusWeeks(2));

        JobPostingResponseDTO response = jobPostingService.createJobPosting(request);

        assertNotNull(response);
        assertEquals("Programador Júnior", response.title());
        assertEquals("Vaga de programador", response.description());
        assertEquals(JobContractType.CLT, response.contractType());
        assertTrue(response.isActive());
    }

    @DisplayName("Cria vaga de emprego sendo profissional")
    @Test
    void createJobPostingAsProfessional(){
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
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);
        userRepository.save(user);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        JobPostingRequestDTO request = new JobPostingRequestDTO(
                "Programador Júnior", "Vaga de programador", "HTML e CSS",
                "Tianguá", JobModel.PRESENCIAL, BigDecimal.valueOf(2000), BigDecimal.valueOf(2500),
                JobContractType.CLT, JobLevel.JUNIOR, LocalDate.now().plusWeeks(2));

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            jobPostingService.createJobPosting(request);
        });
        assertEquals("Usuário logado não é uma empresa.", exception.getMessage());
    }

    @DisplayName("Atualiza vaga de emprego")
    @Test
    void updateJobPosting(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

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

        JobPostingRequestDTO request = new JobPostingRequestDTO(
                "Desenvolvedor Full Stack Sênior", "Desenvolvimento de aplicações web e APIs RESTful",
                "Java, Spring Boot, React, Docker", "Remoto", JobModel.REMOTO,
                BigDecimal.valueOf(8000), BigDecimal.valueOf(10000), JobContractType.PJ, JobLevel.SENIOR,
                LocalDate.now().plusWeeks(4)
        );

        JobPostingResponseDTO response = jobPostingService.updateJobPosting(job.getId(), request);

        assertNotNull(response);
        assertEquals("Desenvolvedor Full Stack Sênior", response.title());
        assertEquals("Desenvolvimento de aplicações web e APIs RESTful", response.description());
        assertEquals("Java, Spring Boot, React, Docker", response.requirements());
        assertTrue(response.isUpdated());
    }

    @DisplayName("Atualiza vaga de emprego sendo um profissional")
    @Test
    void updateJobPostingAsProfessional(){
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
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);
        userRepository.save(user);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

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

        JobPostingRequestDTO request = new JobPostingRequestDTO(
                "Programador Júnior", "Vaga de programador", "HTML e CSS",
                "Tianguá", JobModel.PRESENCIAL, BigDecimal.valueOf(2000), BigDecimal.valueOf(2500),
                JobContractType.CLT, JobLevel.JUNIOR, LocalDate.now().plusWeeks(2));

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            jobPostingService.updateJobPosting(job.getId(), request);
        });
        assertEquals("Usuário logado não é uma empresa.", exception.getMessage());
    }

    @DisplayName("Atualiza vaga de emprego que não existe")
    @Test
    void updateJobPostingNotFound(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        JobPostingRequestDTO request = new JobPostingRequestDTO(
                "Programador Júnior", "Vaga de programador", "HTML e CSS",
                "Tianguá", JobModel.PRESENCIAL, BigDecimal.valueOf(2000), BigDecimal.valueOf(2500),
                JobContractType.CLT, JobLevel.JUNIOR, LocalDate.now().plusWeeks(2));

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            jobPostingService.updateJobPosting(1L, request);
        });
        assertEquals("Vaga não encontrada.", exception.getMessage());
    }

    @DisplayName("Atualiza vaga de emprego que não lhe pertence")
    @Test
    void updateJobPostingWhenIsNotAuthor(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Company company_2 = createTestComapany("Teste", "Teste@email.com", "@teste");
        JobPosting job = new JobPosting();
        job.setCompany(company_2);
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

        JobPostingRequestDTO request = new JobPostingRequestDTO(
                "Desenvolvedor Full Stack Sênior", "Desenvolvimento de aplicações web e APIs RESTful",
                "Java, Spring Boot, React, Docker", "Remoto", JobModel.REMOTO,
                BigDecimal.valueOf(8000), BigDecimal.valueOf(10000), JobContractType.PJ, JobLevel.SENIOR,
                LocalDate.now().plusWeeks(4)
        );

        AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> {
            jobPostingService.updateJobPosting(job.getId(), request);
        });
        assertEquals("Esta vaga não pertence à empresa logada.", exception.getMessage());
    }

    @DisplayName("Desativa vaga de emprego")
    @Test
    void deactivateJobPosting(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

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
        job.setActive(true);
        jobPostingRepository.save(job);

        jobPostingService.deactivateJobPosting(job.getId());

        assertFalse(job.isActive());
    }

    @DisplayName("Desativa vaga de emprego sendo um profissional")
    @Test
    void deactivateJobPostingAsProfessional(){
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
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);
        userRepository.save(user);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

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

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            jobPostingService.deactivateJobPosting(job.getId());
        });
        assertEquals("Usuário logado não é uma empresa.", exception.getMessage());
    }

    @DisplayName("Desativa vaga de emprego que não existe")
    @Test
    void deactivateJobPostingNotFound(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            jobPostingService.deactivateJobPosting(1L);
        });
        assertEquals("Vaga não encontrada.", exception.getMessage());
    }

    @DisplayName("Desativa vaga de emprego que não lhe pertence")
    @Test
    void deactivateJobPostingWhenIsNotAuthor(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Company company_2 = createTestComapany("Teste", "Teste@email.com", "@teste");
        JobPosting job = new JobPosting();
        job.setCompany(company_2);
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

        AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> {
            jobPostingService.deactivateJobPosting(job.getId());
        });
        assertEquals("Esta vaga não pertence à empresa logada.", exception.getMessage());
    }

    @DisplayName("Lista todas as vagas de emprego ativas")
    @Test
    void listPublicJobPostings(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        JobPosting job_1 = new JobPosting();
        job_1.setCompany(company);
        job_1.setTitle("Programador Júnior");
        job_1.setDescription("Vaga de programador");
        job_1.setRequirements("HTML e CSS");
        job_1.setLocation("Tianguá");
        job_1.setJobModel(JobModel.PRESENCIAL);
        job_1.setSalaryMin(BigDecimal.valueOf(2000));
        job_1.setSalaryMax(BigDecimal.valueOf(2500));
        job_1.setContractType(JobContractType.CLT);
        job_1.setJoblevel(JobLevel.JUNIOR);
        job_1.setApplicationDeadline(LocalDate.now().plusWeeks(2));
        jobPostingRepository.save(job_1);

        JobPosting job_2 = new JobPosting();
        job_2.setCompany(company);
        job_2.setTitle("Programador Pleno");
        job_2.setDescription("Vaga de programador");
        job_2.setRequirements("HTML e CSS");
        job_2.setLocation("Tianguá");
        job_2.setJobModel(JobModel.PRESENCIAL);
        job_2.setSalaryMin(BigDecimal.valueOf(2000));
        job_2.setSalaryMax(BigDecimal.valueOf(2500));
        job_2.setContractType(JobContractType.CLT);
        job_2.setJoblevel(JobLevel.JUNIOR);
        job_2.setApplicationDeadline(LocalDate.now().minusWeeks(1));
        jobPostingRepository.save(job_2);

        JobPosting job_3 = new JobPosting();
        job_3.setCompany(company);
        job_3.setTitle("Programador Senior");
        job_3.setDescription("Vaga de programador");
        job_3.setRequirements("HTML e CSS");
        job_3.setLocation("Tianguá");
        job_3.setJobModel(JobModel.PRESENCIAL);
        job_3.setSalaryMin(BigDecimal.valueOf(2000));
        job_3.setSalaryMax(BigDecimal.valueOf(2500));
        job_3.setContractType(JobContractType.CLT);
        job_3.setJoblevel(JobLevel.JUNIOR);
        job_3.setApplicationDeadline(LocalDate.now().plusWeeks(2));
        job_3.setActive(false);
        jobPostingRepository.save(job_3);

        JobPosting job_4 = new JobPosting();
        job_4.setCompany(company);
        job_4.setTitle("Estágio em programador");
        job_4.setDescription("Vaga de programador");
        job_4.setRequirements("HTML e CSS");
        job_4.setLocation("Tianguá");
        job_4.setJobModel(JobModel.PRESENCIAL);
        job_4.setSalaryMin(BigDecimal.valueOf(2000));
        job_4.setSalaryMax(BigDecimal.valueOf(2500));
        job_4.setContractType(JobContractType.CLT);
        job_4.setJoblevel(JobLevel.JUNIOR);
        job_4.setApplicationDeadline(LocalDate.now().plusWeeks(1));
        job_4.setUpdated(true);
        jobPostingRepository.save(job_4);

        List<JobPostingSummaryResponseDTO> response = jobPostingService.getPublicJobPostings();

        assertNotNull(response);
        assertEquals(2, response.size());
        assertEquals("Estágio em programador", response.getFirst().title());
        assertTrue(response.getFirst().isUpdated());
        assertEquals("Programador Júnior", response.get(1).title());
        assertFalse(response.stream().anyMatch
                (job -> job.title().equals("Programador Pleno")));
        assertFalse(response.stream().anyMatch
                (job -> job.title().equals("Programador Senior")));
    }

    @DisplayName("Exibe detalhes de uma vaga ativa")
    @Test
    void showJobPostingDetails(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

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

        PublicJobPostingResponseDTO response = jobPostingService.getPublicById(job.getId());

        assertNotNull(response);
        assertEquals("Programador Júnior", response.title());
        assertEquals("Vaga de programador", response.description());
        assertEquals("HTML e CSS", response.requirements());
        assertEquals(JobModel.PRESENCIAL, response.jobModel());
    }

    @DisplayName("Exibe detalhes de uma vaga que não existe ou está inativa")
    @Test
    void showJobPostingDetailsNotFoundOrDeactivated(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

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
        job.setActive(false);
        jobPostingRepository.save(job);

        EntityNotFoundException exception_1 = assertThrows(EntityNotFoundException.class, () -> {
                jobPostingService.getPublicById(10L);
        });
        assertEquals("Vaga não encontrada ou inativa", exception_1.getMessage());
        EntityNotFoundException exception_2 = assertThrows(EntityNotFoundException.class, () -> {
            jobPostingService.getPublicById(job.getId());
        });
        assertEquals("Vaga não encontrada ou inativa", exception_2.getMessage());
    }

    @DisplayName("Exibe todas as vagas de emprego ativas de uma empresa")
    @Test
    void listPublicJobPostingsByCompany(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        JobPosting job_1 = new JobPosting();
        job_1.setCompany(company);
        job_1.setTitle("Programador Júnior");
        job_1.setDescription("Vaga de programador");
        job_1.setRequirements("HTML e CSS");
        job_1.setLocation("Tianguá");
        job_1.setJobModel(JobModel.PRESENCIAL);
        job_1.setSalaryMin(BigDecimal.valueOf(2000));
        job_1.setSalaryMax(BigDecimal.valueOf(2500));
        job_1.setContractType(JobContractType.CLT);
        job_1.setJoblevel(JobLevel.JUNIOR);
        job_1.setApplicationDeadline(LocalDate.now().plusWeeks(2));
        jobPostingRepository.save(job_1);

        JobPosting job_2 = new JobPosting();
        job_2.setCompany(company);
        job_2.setTitle("Programador Pleno");
        job_2.setDescription("Vaga de programador");
        job_2.setRequirements("HTML e CSS");
        job_2.setLocation("Tianguá");
        job_2.setJobModel(JobModel.PRESENCIAL);
        job_2.setSalaryMin(BigDecimal.valueOf(2000));
        job_2.setSalaryMax(BigDecimal.valueOf(2500));
        job_2.setContractType(JobContractType.CLT);
        job_2.setJoblevel(JobLevel.JUNIOR);
        job_2.setApplicationDeadline(LocalDate.now().minusWeeks(1));
        jobPostingRepository.save(job_2);

        JobPosting job_3 = new JobPosting();
        job_3.setCompany(company);
        job_3.setTitle("Programador Senior");
        job_3.setDescription("Vaga de programador");
        job_3.setRequirements("HTML e CSS");
        job_3.setLocation("Tianguá");
        job_3.setJobModel(JobModel.PRESENCIAL);
        job_3.setSalaryMin(BigDecimal.valueOf(2000));
        job_3.setSalaryMax(BigDecimal.valueOf(2500));
        job_3.setContractType(JobContractType.CLT);
        job_3.setJoblevel(JobLevel.JUNIOR);
        job_3.setApplicationDeadline(LocalDate.now().plusWeeks(2));
        job_3.setActive(false);
        jobPostingRepository.save(job_3);

        JobPosting job_4 = new JobPosting();
        job_4.setCompany(company);
        job_4.setTitle("Estágio em programador");
        job_4.setDescription("Vaga de programador");
        job_4.setRequirements("HTML e CSS");
        job_4.setLocation("Tianguá");
        job_4.setJobModel(JobModel.PRESENCIAL);
        job_4.setSalaryMin(BigDecimal.valueOf(2000));
        job_4.setSalaryMax(BigDecimal.valueOf(2500));
        job_4.setContractType(JobContractType.CLT);
        job_4.setJoblevel(JobLevel.JUNIOR);
        job_4.setApplicationDeadline(LocalDate.now().plusWeeks(1));
        job_4.setUpdated(true);
        jobPostingRepository.save(job_4);

        Company company_2 = createTestComapany("Teste", "teste@email.com", "@Teste");
        JobPosting job_5 = new JobPosting();
        job_5.setCompany(company_2);
        job_5.setTitle("Vaga de outra empresa");
        job_5.setDescription("Vaga de programador");
        job_5.setRequirements("HTML e CSS");
        job_5.setLocation("Tianguá");
        job_5.setJobModel(JobModel.PRESENCIAL);
        job_5.setSalaryMin(BigDecimal.valueOf(2000));
        job_5.setSalaryMax(BigDecimal.valueOf(2500));
        job_5.setContractType(JobContractType.CLT);
        job_5.setJoblevel(JobLevel.JUNIOR);
        job_5.setApplicationDeadline(LocalDate.now().plusWeeks(1));
        job_5.setUpdated(true);
        jobPostingRepository.save(job_5);

        List<JobPostingSummaryResponseDTO> response = jobPostingService.getPublicJobPostingsByCompany(company.getUserId());

        assertNotNull(response);
        assertEquals(2, response.size());
        assertEquals("Estágio em programador", response.getFirst().title());
        assertTrue(response.getFirst().isUpdated());
        assertEquals("Programador Júnior", response.get(1).title());
        assertFalse(response.stream().anyMatch
                (job -> job.title().equals("Programador Pleno")));
        assertFalse(response.stream().anyMatch
                (job -> job.title().equals("Programador Senior")));
        assertFalse(response.stream().anyMatch
                (job -> job.title().equals("Vaga de outra empresa")));
    }

    @DisplayName("Exibe todas as vagas de emprego da empresa logada (ativas ou inativas)")
    @Test
    void listAllJobPostingsByLoggedCompany(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        JobPosting job_1 = new JobPosting();
        job_1.setCompany(company);
        job_1.setTitle("Programador Júnior");
        job_1.setDescription("Vaga de programador");
        job_1.setRequirements("HTML e CSS");
        job_1.setLocation("Tianguá");
        job_1.setJobModel(JobModel.PRESENCIAL);
        job_1.setSalaryMin(BigDecimal.valueOf(2000));
        job_1.setSalaryMax(BigDecimal.valueOf(2500));
        job_1.setContractType(JobContractType.CLT);
        job_1.setJoblevel(JobLevel.JUNIOR);
        job_1.setApplicationDeadline(LocalDate.now().plusWeeks(2));
        jobPostingRepository.save(job_1);

        JobPosting job_2 = new JobPosting();
        job_2.setCompany(company);
        job_2.setTitle("Programador Pleno");
        job_2.setDescription("Vaga de programador");
        job_2.setRequirements("HTML e CSS");
        job_2.setLocation("Tianguá");
        job_2.setJobModel(JobModel.PRESENCIAL);
        job_2.setSalaryMin(BigDecimal.valueOf(2000));
        job_2.setSalaryMax(BigDecimal.valueOf(2500));
        job_2.setContractType(JobContractType.CLT);
        job_2.setJoblevel(JobLevel.JUNIOR);
        job_2.setApplicationDeadline(LocalDate.now().minusWeeks(1));
        jobPostingRepository.save(job_2);

        JobPosting job_3 = new JobPosting();
        job_3.setCompany(company);
        job_3.setTitle("Programador Senior");
        job_3.setDescription("Vaga de programador");
        job_3.setRequirements("HTML e CSS");
        job_3.setLocation("Tianguá");
        job_3.setJobModel(JobModel.PRESENCIAL);
        job_3.setSalaryMin(BigDecimal.valueOf(2000));
        job_3.setSalaryMax(BigDecimal.valueOf(2500));
        job_3.setContractType(JobContractType.CLT);
        job_3.setJoblevel(JobLevel.JUNIOR);
        job_3.setApplicationDeadline(LocalDate.now().plusWeeks(2));
        job_3.setActive(false);
        jobPostingRepository.save(job_3);

        JobPosting job_4 = new JobPosting();
        job_4.setCompany(company);
        job_4.setTitle("Estágio em programador");
        job_4.setDescription("Vaga de programador");
        job_4.setRequirements("HTML e CSS");
        job_4.setLocation("Tianguá");
        job_4.setJobModel(JobModel.PRESENCIAL);
        job_4.setSalaryMin(BigDecimal.valueOf(2000));
        job_4.setSalaryMax(BigDecimal.valueOf(2500));
        job_4.setContractType(JobContractType.CLT);
        job_4.setJoblevel(JobLevel.JUNIOR);
        job_4.setApplicationDeadline(LocalDate.now().plusWeeks(1));
        job_4.setUpdated(true);
        jobPostingRepository.save(job_4);

        Company company_2 = createTestComapany("Teste", "teste@email.com", "@Teste");
        JobPosting job_5 = new JobPosting();
        job_5.setCompany(company_2);
        job_5.setTitle("Vaga de outra empresa");
        job_5.setDescription("Vaga de programador");
        job_5.setRequirements("HTML e CSS");
        job_5.setLocation("Tianguá");
        job_5.setJobModel(JobModel.PRESENCIAL);
        job_5.setSalaryMin(BigDecimal.valueOf(2000));
        job_5.setSalaryMax(BigDecimal.valueOf(2500));
        job_5.setContractType(JobContractType.CLT);
        job_5.setJoblevel(JobLevel.JUNIOR);
        job_5.setApplicationDeadline(LocalDate.now().plusWeeks(1));
        job_5.setUpdated(true);
        jobPostingRepository.save(job_5);

        List<JobPostingSummaryResponseDTO> response = jobPostingService.getCompanyJobPostings();

        assertNotNull(response);
        assertEquals(4, response.size());
        assertEquals("Programador Júnior", response.getFirst().title());
        assertEquals("Programador Senior", response.get(1).title());
        assertFalse(response.get(1).isActive());
        assertEquals("Estágio em programador", response.get(2).title());
        assertTrue(response.get(2).isUpdated());
        assertEquals("Programador Pleno", response.get(3).title());
        assertTrue(response.get(3).isExpired());
        assertFalse(response.stream().anyMatch
                (job -> job.title().equals("Vaga de outra empresa")));
    }

    @DisplayName("Exibe todas as vagas de emprego de usuário que não é empresa")
    @Test
    void listAllJobPostingsAsProfessional(){
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
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);
        userRepository.save(user);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        EntityNotFoundException exception =  assertThrows(EntityNotFoundException.class, () -> {
            jobPostingService.getCompanyJobPostings();
        });
        assertEquals("Usuário logado não é uma empresa.", exception.getMessage());
    }

    @DisplayName("Exibe detalhes de uma vaga para a empresa que a criou (mesmo inativa)")
    @Test
    void showJobPostingDetailsForCompany(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

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
        job.setActive(false);
        jobPostingRepository.save(job);

        JobPostingResponseDTO response = jobPostingService.getCompanyById(job.getId());

        assertNotNull(response);
        assertEquals("Programador Júnior", response.title());
        assertEquals("Vaga de programador", response.description());
        assertEquals("HTML e CSS", response.requirements());
        assertEquals(JobModel.PRESENCIAL, response.jobModel());
        assertFalse(response.isActive());
    }

    @DisplayName("Exibe detalhes de uma vaga inativa sendo um profissional")
    @Test
    void showDeactivateJobPostingDetailsAsProfessional(){
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
        job.setActive(false);
        jobPostingRepository.save(job);

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
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);
        userRepository.save(user);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        EntityNotFoundException exception =  assertThrows(EntityNotFoundException.class, () -> {
            jobPostingService.getCompanyById(job.getId());
        });
        assertEquals("Usuário logado não é uma empresa.", exception.getMessage());
    }

    @DisplayName("Exibe detalhes de uma vaga que não lhe pertence")
    @Test
    void showDeactivateJobPostingDetailsWhenIsNotAuthor(){
        Company company = createTestComapany("HerTechRise", "hertech@email.com", "@hertech");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(company.getUser(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Company company_2 = createTestComapany("Teste", "Teste@email.com", "@teste");
        JobPosting job = new JobPosting();
        job.setCompany(company_2);
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
        job.setActive(false);
        jobPostingRepository.save(job);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            jobPostingService.getCompanyById(job.getId());
        });
        assertEquals("Vaga não encontrada para sua empresa", exception.getMessage());
    }
}