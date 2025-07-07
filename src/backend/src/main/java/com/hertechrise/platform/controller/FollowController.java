package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.FollowControllerDocs;
import com.hertechrise.platform.data.dto.request.FollowRequestDTO;
import com.hertechrise.platform.data.dto.request.UnfollowRequestDTO;
import com.hertechrise.platform.data.dto.response.FollowResponseDTO;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import com.hertechrise.platform.services.FollowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController implements FollowControllerDocs {

    private final FollowService followService;

    @PostMapping
    public ResponseEntity<FollowResponseDTO> follow(@RequestBody @Valid FollowRequestDTO request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(followService.follow(request));
    }

    @DeleteMapping()
    public ResponseEntity<MessageResponseDTO> unfollow(@RequestBody @Valid UnfollowRequestDTO request) {
        followService.unfollow(request);
        return ResponseEntity.ok(new MessageResponseDTO("Você deixou de seguir esse usuário."));
    }

    @GetMapping("/following")
    public ResponseEntity<List<FollowResponseDTO>> listFollowing() {
        return ResponseEntity
                .ok()
                .body(followService.listFollowing());
    }

    @GetMapping("/followers")
    public ResponseEntity<List<FollowResponseDTO>> listFollowers() {
        return ResponseEntity
                .ok()
                .body(followService.listFollowers());
    }
}
