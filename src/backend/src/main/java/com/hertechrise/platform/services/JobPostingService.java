package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.JobPostingRequestDTO;
import com.hertechrise.platform.data.dto.response.JobPostingResponseDTO;
import com.hertechrise.platform.data.dto.response.JobPostingSummaryResponseDTO;
import com.hertechrise.platform.model.Company;
import com.hertechrise.platform.model.JobPosting;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.repository.CompanyRepository;
import com.hertechrise.platform.repository.JobPostingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public JobPostingResponseDTO createJobPosting(JobPostingRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= (User) auth.getPrincipal();

        Company loggedCompany = companyRepository.findById(loggedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não é uma empresa."));

        JobPosting jobPosting = new JobPosting();
        jobPosting.setTitle(request.title());
        jobPosting.setDescription(request.description());
        jobPosting.setRequirements(request.requirements());
        jobPosting.setLocation(request.location());
        jobPosting.setJobModel(request.jobModel());
        jobPosting.setSalaryMin(request.salaryMin());
        jobPosting.setSalaryMax(request.salaryMax());
        jobPosting.setContractType(request.contractType());
        jobPosting.setJoblevel(request.jobLevel());
        jobPosting.setApplicationDeadline(request.applicationDeadline());
        jobPosting.setCompany(loggedCompany);

        JobPosting saved = jobPostingRepository.save(jobPosting);
        return mapEntityToDto(saved);
    }

    @Transactional
    public JobPostingResponseDTO updateJobPosting(Long id, JobPostingRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= (User) auth.getPrincipal();

        Company loggedCompany = companyRepository.findById(loggedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não é uma empresa."));

        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vaga não encontrada."));

        if (!jobPosting.getCompany().getUserId().equals(loggedCompany.getUserId())) {
            throw new AccessDeniedException("Esta vaga não pertence à empresa logada.");
        }

        jobPosting.setTitle(request.title());
        jobPosting.setDescription(request.description());
        jobPosting.setRequirements(request.requirements());
        jobPosting.setLocation(request.location());
        jobPosting.setJobModel(request.jobModel());
        jobPosting.setSalaryMin(request.salaryMin());
        jobPosting.setSalaryMax(request.salaryMax());
        jobPosting.setContractType(request.contractType());
        jobPosting.setJoblevel(request.jobLevel());
        jobPosting.setUpdated(true);
        jobPosting.setApplicationDeadline(request.applicationDeadline());

        JobPosting updated = jobPostingRepository.save(jobPosting);
        return mapEntityToDto(updated);
    }

    @Transactional
    public void deactivateJobPosting(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= (User) auth.getPrincipal();

        Company loggedCompany = companyRepository.findById(loggedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não é uma empresa."));

        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vaga não encontrada."));

        if (!jobPosting.getCompany().getUserId().equals(loggedCompany.getUserId())) {
            throw new AccessDeniedException("Esta vaga não pertence à empresa logada.");
        }

        jobPosting.setActive(false);

        jobPostingRepository.save(jobPosting);
    }

    @Transactional(readOnly = true)
    public List<JobPostingSummaryResponseDTO> getPublicJobPostings() {
        return jobPostingRepository.findByActiveTrueAndApplicationDeadlineGreaterThanEqualOrderByApplicationDeadlineAsc(LocalDate.now())
                .stream()
                .map(this::mapEntityToSummaryDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public JobPostingResponseDTO getPublicById(Long id) {
        JobPosting job = jobPostingRepository.findByIdAndActiveTrueAndApplicationDeadlineGreaterThanEqual(id, LocalDate.now())
                .orElseThrow(() -> new EntityNotFoundException("Vaga não encontrada ou inativa"));
        return mapEntityToDto(job);
    }

    @Transactional(readOnly = true)
    public List<JobPostingSummaryResponseDTO> getPublicJobPostingsByCompany(Long companyId) {
        return jobPostingRepository.findByCompanyUserIdAndActiveTrueAndApplicationDeadlineGreaterThanEqualOrderByApplicationDeadlineAsc(companyId, LocalDate.now())
                .stream()
                .map(this::mapEntityToSummaryDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<JobPostingSummaryResponseDTO> getCompanyJobPostings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= (User) auth.getPrincipal();

        Company loggedCompany = companyRepository.findById(loggedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não é uma empresa."));

        return jobPostingRepository.findByCompanyOrderByApplicationDeadlineDesc(loggedCompany)
                .stream()
                .map(this::mapEntityToSummaryDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public JobPostingResponseDTO getCompanyById(Long postId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser= (User) auth.getPrincipal();

        Company loggedCompany = companyRepository.findById(loggedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não é uma empresa."));

        JobPosting job = jobPostingRepository.findByIdAndCompany(postId, loggedCompany)
                .orElseThrow(() -> new EntityNotFoundException("Vaga não encontrada para sua empresa"));
        return mapEntityToDto(job);
    }

    private JobPostingResponseDTO mapEntityToDto(JobPosting job) {
        return new JobPostingResponseDTO(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getRequirements(),
                job.getLocation(),
                job.getJobModel(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.getContractType(),
                job.getJoblevel(),
                job.getApplicationDeadline(),
                job.isActive(),
                job.isExpired(),
                job.getCreatedAt(),
                job.isUpdated(),
                job.getUpdatedAt(),
                job.getCompany().getUser().getName(),
                job.getCompany().getUser().getProfilePic(),
                job.getCompany().getUserId()
        );
    }

    private JobPostingSummaryResponseDTO mapEntityToSummaryDto(JobPosting job) {
        return new JobPostingSummaryResponseDTO(
                job.getId(),
                job.getTitle(),
                job.getCompany().getUser().getName(),
                job.getLocation(),
                job.getDescription(),
                job.getRequirements(),
                job.getContractType(),
                job.getJobModel(),
                job.getApplicationDeadline(),
                job.isActive(),
                job.isExpired(),
                job.isUpdated(),
                job.getUpdatedAt(),
                job.getCompany().getUser().getProfilePic(),
                job.getCompany().getUserId()
        );
    }
}
