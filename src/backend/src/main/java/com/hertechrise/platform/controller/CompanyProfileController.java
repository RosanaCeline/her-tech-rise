package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.CompanyProfileControllerDocs;
import com.hertechrise.platform.data.dto.request.CompanyProfileRequestDTO;
import com.hertechrise.platform.data.dto.response.CompanyProfileResponseDTO;
import com.hertechrise.platform.services.CompanyProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles/companies")
@RequiredArgsConstructor
public class CompanyProfileController implements CompanyProfileControllerDocs {

    private final CompanyProfileService profileService;

    @GetMapping("/{id}")
    public ResponseEntity<CompanyProfileResponseDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getProfile(id));
    }

    @PutMapping("/update")
    public ResponseEntity<CompanyProfileResponseDTO> updateMyProfile(@RequestBody CompanyProfileRequestDTO request) {
        return ResponseEntity.ok(profileService.updateMyProfile(request));
    }
}
