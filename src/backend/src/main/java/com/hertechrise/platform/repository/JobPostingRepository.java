package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.Company;
import com.hertechrise.platform.model.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

    List<JobPosting> findByCompanyUserId(Long companyUserId);


    // Apenas vagas ativas com prazo válido, ordenadas pelo prazo mais próximo
    List<JobPosting> findByActiveTrueAndApplicationDeadlineGreaterThanEqualOrderByApplicationDeadlineAsc(LocalDate currentDate);

    // Buscar uma vaga ativa e ainda no prazo pelo ID
    Optional<JobPosting> findByIdAndActiveTrueAndApplicationDeadlineGreaterThanEqual(Long id, LocalDate currentDate);

    // Vagas ativas e ainda no prazo de uma empresa, ordenadas pelo prazo mais próximo
    List<JobPosting> findByCompanyUserIdAndActiveTrueAndApplicationDeadlineGreaterThanEqualOrderByApplicationDeadlineAsc(Long userId, LocalDate currentDate);

    // Vagas ativas, inativas e expiradas da empresa criadora, ordenadas pelo prazo mais próximo
    List<JobPosting> findByCompanyOrderByApplicationDeadlineDesc(Company company);

    //
    Optional<JobPosting> findByIdAndCompany(Long id, Company company);
}
