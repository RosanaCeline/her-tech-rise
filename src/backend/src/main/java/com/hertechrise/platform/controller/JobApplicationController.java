package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.JobApplicationControllerDocs;
import com.hertechrise.platform.data.dto.request.JobApplicationRequestDTO;
import com.hertechrise.platform.data.dto.response.CandidateApplicationDetailsResponseDTO;
import com.hertechrise.platform.data.dto.response.CandidateApplicationSummaryResponseDTO;
import com.hertechrise.platform.data.dto.response.ReceivedApplicationDetailsResponseDTO;
import com.hertechrise.platform.data.dto.response.ReceivedApplicationsByJobResponseDTO;
import com.hertechrise.platform.services.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
@RequiredArgsConstructor
public class JobApplicationController implements JobApplicationControllerDocs {

    private final JobApplicationService jobApplicationService;

    @PostMapping
    public ResponseEntity<CandidateApplicationDetailsResponseDTO> applyToJob(@ModelAttribute JobApplicationRequestDTO requestDTO) {
        CandidateApplicationDetailsResponseDTO created = jobApplicationService.applyToJob(requestDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/my/{applicationId}")
    public ResponseEntity<CandidateApplicationDetailsResponseDTO> getMyApplicationDetails(
            @PathVariable Long applicationId) {
        return ResponseEntity.ok(jobApplicationService.getMyApplicationDetails(applicationId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<CandidateApplicationSummaryResponseDTO>> listMyApplications() {
        return ResponseEntity.ok(jobApplicationService.listMyApplications());
    }

    @GetMapping("/received/{applicationId}")
    public ResponseEntity<ReceivedApplicationDetailsResponseDTO> getReceivedApplicationDetails(
            @PathVariable Long applicationId) {
        return ResponseEntity.ok(jobApplicationService.getReceivedApplicationDetails(applicationId));
    }

    @GetMapping("/received/job/{jobId}")
    public ResponseEntity<ReceivedApplicationsByJobResponseDTO> listReceivedApplicationsByJob(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(jobApplicationService.listReceivedApplicationsByJob(jobId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        jobApplicationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
