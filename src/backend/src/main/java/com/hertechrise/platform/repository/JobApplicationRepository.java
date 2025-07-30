package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByProfessionalUserId(Long professionalId);

    List<JobApplication> findByJobPostingId(Long jobPostingId);
}
