package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.JobPostingControllerDocs;
import com.hertechrise.platform.data.dto.request.JobPostingRequestDTO;
import com.hertechrise.platform.data.dto.response.JobPostingResponseDTO;
import com.hertechrise.platform.data.dto.response.JobPostingSummaryResponseDTO;
import com.hertechrise.platform.services.JobPostingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-postings")
@RequiredArgsConstructor
public class JobPostingController implements JobPostingControllerDocs {

    private final JobPostingService jobPostingService;

    @PostMapping
    public ResponseEntity<JobPostingResponseDTO> create(@Valid @RequestBody JobPostingRequestDTO dto) {
        JobPostingResponseDTO created = jobPostingService.createJobPosting(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobPostingResponseDTO> update(@PathVariable Long id, @Valid @RequestBody JobPostingRequestDTO dto) {
        JobPostingResponseDTO updated = jobPostingService.updateJobPosting(id, dto);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<String> deactivateJobPosting(@PathVariable Long id) {
        jobPostingService.deactivateJobPosting(id);
        return ResponseEntity.ok("Vaga desativada com sucesso.");
    }

    @GetMapping("/public")
    public ResponseEntity<List<JobPostingSummaryResponseDTO>> getPublicJobPostings() {
        return ResponseEntity.ok(jobPostingService.getPublicJobPostings());
    }

    @GetMapping("/public/{postId}")
    public ResponseEntity<JobPostingResponseDTO> getPublicById(@PathVariable Long postId) {
        return ResponseEntity.ok(jobPostingService.getPublicById(postId));
    }

    @GetMapping("/public/list/{companyId}")
    public ResponseEntity<List<JobPostingSummaryResponseDTO>> getPublicJobPostingsByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(jobPostingService.getPublicJobPostingsByCompany(companyId));
    }

    @GetMapping("/company")
    public ResponseEntity<List<JobPostingSummaryResponseDTO>> getCompanyJobPostings() {
        return ResponseEntity.ok(jobPostingService.getCompanyJobPostings());
    }

    @GetMapping("/company/{postId}")
    public ResponseEntity<JobPostingResponseDTO> getCompanyById(@PathVariable Long postId) {
        return ResponseEntity.ok(jobPostingService.getCompanyById(postId));
    }
}

