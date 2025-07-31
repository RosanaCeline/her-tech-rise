package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.JobApplicationRequestDTO;
import com.hertechrise.platform.data.dto.response.*;
import com.hertechrise.platform.exception.AlreadyCandidateException;
import com.hertechrise.platform.model.JobApplication;
import com.hertechrise.platform.model.JobPosting;
import com.hertechrise.platform.model.Professional;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.repository.JobApplicationRepository;
import com.hertechrise.platform.repository.JobPostingRepository;
import com.hertechrise.platform.repository.ProfessionalRepository;
import com.hertechrise.platform.utils.HibernateUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobPostingRepository jobPostingRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final ProfessionalRepository professionalRepository;
    private final CloudinaryService cloudinaryService;

    private final EntityManager entityManager;

    @Transactional
    public CandidateApplicationDetailsResponseDTO applyToJob(JobApplicationRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= (User) auth.getPrincipal();

        Professional professional = professionalRepository.findById(loggedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não é um profissional."));

        JobPosting jobPosting = jobPostingRepository.findById(request.jobPostingId())
                .orElseThrow(() -> new EntityNotFoundException("Vaga não encontrada."));

        List<JobApplication> applications = jobApplicationRepository
                .findAllByJobPostingIdAndProfessionalUserId(jobPosting.getId(), loggedUser.getId());

        boolean hasActive = applications.stream().anyMatch(a -> !a.isDeleted());

        if (hasActive) {
            throw new AlreadyCandidateException();
        }

        String resumeUrl = cloudinaryService.uploadResumeFile(request.resumeFile(), loggedUser.getName()) ;

        JobApplication application = new JobApplication();
        application.setJobPosting(jobPosting);
        application.setProfessional(professional);
        application.setGithubLink(request.githubLink());
        application.setPortfolioLink(request.portfolioLink());
        application.setResumeUrl(resumeUrl);
        application.setAppliedAt(LocalDateTime.now());

        jobApplicationRepository.save(application);

        return mapToCandidateDetailsDto(application);
    }

    @Transactional(readOnly = true)
    public CandidateApplicationDetailsResponseDTO getMyApplicationDetails(Long applicationId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        HibernateUtils.enableDeletedFilter(entityManager);

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Candidatura não encontrada."));

        if (!application.getProfessional().getUser().getId().equals(loggedUser.getId())) {
            throw new SecurityException("Você não tem permissão para ver essa candidatura.");
        }

        return mapToCandidateDetailsDto(application);
    }

    @Transactional(readOnly = true)
    public ReceivedApplicationDetailsResponseDTO getReceivedApplicationDetails(Long applicationId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        HibernateUtils.enableDeletedFilter(entityManager);

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Candidatura não encontrada."));

        Long companyUserId = application.getJobPosting().getCompany().getUserId();

        if (!companyUserId.equals(loggedUser.getId())) {
            throw new SecurityException("Você não tem permissão para ver essa candidatura.");
        }

        return mapToReceivedDetailsDto(application);
    }

    @Transactional(readOnly = true)
    public List<CandidateApplicationSummaryResponseDTO> listMyApplications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        HibernateUtils.enableDeletedFilter(entityManager);

        Professional professional = professionalRepository.findById(loggedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não é um profissional."));

        List<JobApplication> applications = jobApplicationRepository.findByProfessionalUserId(professional.getUserId());

        return applications.stream()
                .map(this::mapToCandidateSummaryDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReceivedApplicationsByJobResponseDTO listReceivedApplicationsByJob(Long jobId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        HibernateUtils.enableDeletedFilter(entityManager);

        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new EntityNotFoundException("Vaga não encontrada."));

        if (!jobPosting.getCompany().getUserId().equals(loggedUser.getId())) {
            throw new SecurityException("Você não tem permissão para visualizar candidaturas dessa vaga.");
        }

        List<JobApplication> applications = jobApplicationRepository.findByJobPostingId(jobId);

        return mapToReceivedByJobDto(jobPosting, applications);
    }

    @Transactional
    public void deleteById(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        HibernateUtils.enableDeletedFilter(entityManager);

        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Candidatura não encontrada"));

        if (!application.getProfessional().getUser().getId().equals(loggedUser.getId())) {
            throw new SecurityException("Você não tem permissão para deletar essa candidatura.");
        }

        application.setDeleted(true);
        jobApplicationRepository.save(application);
    }

    private CandidateApplicationDetailsResponseDTO mapToCandidateDetailsDto(JobApplication application) {
        return new CandidateApplicationDetailsResponseDTO(
                application.getId(),
                application.getProfessional().getUserId(),
                application.getProfessional().getUser().getName(),
                application.getProfessional().getTechnology(),
                application.getProfessional().getUser().getPhoneNumber(),
                application.getProfessional().getUser().getEmail(),
                application.getProfessional().getUser().getProfilePic(),
                application.getResumeUrl(),
                application.getGithubLink(),
                application.getPortfolioLink(),
                application.getJobPosting().getTitle(),
                application.getAppliedAt(),
                application.getJobPosting().getApplicationDeadline(),
                application.getJobPosting().isActive(),
                application.getJobPosting().isExpired(),
                application.getJobPosting().getCompany().getUser().getName(),
                application.getJobPosting().getCompany().getUser().getProfilePic(),
                application.getJobPosting().getCompany().getUserId()
        );
    }

    private CandidateApplicationSummaryResponseDTO mapToCandidateSummaryDto(JobApplication application) {
        return new CandidateApplicationSummaryResponseDTO(
                application.getId(),
                application.getJobPosting().getId(),
                application.getJobPosting().getTitle(),
                application.getAppliedAt(),
                application.getJobPosting().getApplicationDeadline(),
                application.getJobPosting().isActive(),
                application.getJobPosting().isExpired(),
                application.getJobPosting().getCompany().getUser().getName(),
                application.getJobPosting().getCompany().getUser().getProfilePic(),
                application.getJobPosting().getCompany().getUserId()
        );
    }

    private ReceivedApplicationDetailsResponseDTO mapToReceivedDetailsDto(JobApplication application) {
        return new ReceivedApplicationDetailsResponseDTO(
                application.getId(),
                application.getProfessional().getUserId(),
                application.getProfessional().getUser().getName(),
                application.getProfessional().getTechnology(),
                application.getProfessional().getUser().getPhoneNumber(),
                application.getProfessional().getUser().getEmail(),
                application.getProfessional().getUser().getProfilePic(),
                application.getResumeUrl(),
                application.getGithubLink(),
                application.getPortfolioLink(),
                application.getJobPosting().getTitle(),
                application.getAppliedAt(),
                application.getJobPosting().getApplicationDeadline(),
                application.getJobPosting().isActive(),
                application.getJobPosting().isExpired()
        );
    }

    private ReceivedApplicationSummaryResponseDTO mapToReceivedSummaryDto(JobApplication application) {
        return new ReceivedApplicationSummaryResponseDTO(
                application.getId(),
                application.getProfessional().getUserId(),
                application.getProfessional().getUser().getName(),
                application.getProfessional().getTechnology(),
                application.getProfessional().getUser().getPhoneNumber(),
                application.getProfessional().getUser().getEmail(),
                application.getProfessional().getUser().getProfilePic(),
                application.getAppliedAt()
        );
    }

    private ReceivedApplicationsByJobResponseDTO mapToReceivedByJobDto(JobPosting job, List<JobApplication> applications) {
        List<ReceivedApplicationSummaryResponseDTO> appSummaries = applications.stream()
                .map(this::mapToReceivedSummaryDto)
                .toList();

        return new ReceivedApplicationsByJobResponseDTO(
                job.getId(),
                job.getTitle(),
                job.getApplicationDeadline(),
                job.isActive(),
                job.isExpired(),
                job.getCompany().getUser().getName(),
                job.getCompany().getUser().getProfilePic(),
                applications.size(),
                appSummaries
        );
    }

}

