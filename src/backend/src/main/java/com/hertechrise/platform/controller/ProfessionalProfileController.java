package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.ProfessionalProfileControllerDocs;
import com.hertechrise.platform.data.dto.request.ProfessionalProfileRequestDTO;
import com.hertechrise.platform.data.dto.response.MyProfessionalProfileResponseDTO;
import com.hertechrise.platform.data.dto.response.ProfessionalProfileResponseDTO;
import com.hertechrise.platform.services.ProfessionalProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles/professionals")
@RequiredArgsConstructor
public class ProfessionalProfileController implements ProfessionalProfileControllerDocs {

    private final ProfessionalProfileService profileService;

    @GetMapping("/{id}")
    public ResponseEntity<ProfessionalProfileResponseDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getProfile(id));
    }

    @PutMapping("/update")
    public ResponseEntity<ProfessionalProfileResponseDTO> updateMyProfile(@RequestBody ProfessionalProfileRequestDTO request) {
        return ResponseEntity.ok(profileService.updateMyProfile(request));
    }

    @GetMapping("/me")
    public ResponseEntity<MyProfessionalProfileResponseDTO> getMyProfile() {
        return ResponseEntity.ok(profileService.getMyProfile());
    }
}
