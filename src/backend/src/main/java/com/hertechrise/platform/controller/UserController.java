package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.UserControllerDocs;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import com.hertechrise.platform.data.dto.response.UserPictureResponseDTO;
import com.hertechrise.platform.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController implements UserControllerDocs {

    private final UserService userService;

    @PutMapping("/profile-picture")
    public ResponseEntity<UserPictureResponseDTO> updateProfilePicture(@RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(userService.updateProfilePicture(file));
    }

    @DeleteMapping("/deactivate")
    public ResponseEntity<MessageResponseDTO> deactivateMyProfile() {
        userService.deactivateMyProfile();
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(new MessageResponseDTO("Conta excluída com sucesso."));
    }
}