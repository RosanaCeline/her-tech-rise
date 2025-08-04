package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.PostControllerDocs;
import com.hertechrise.platform.data.dto.request.PostEditRequestDTO;
import com.hertechrise.platform.data.dto.request.PostFilterRequestDTO;
import com.hertechrise.platform.data.dto.request.PostRequestDTO;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import com.hertechrise.platform.data.dto.response.PostMessageResponseDTO;
import com.hertechrise.platform.data.dto.response.PostResponseDTO;
import com.hertechrise.platform.data.dto.response.UnifiedPostResponseDTO;
import com.hertechrise.platform.model.PostVisibility;
import com.hertechrise.platform.services.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController implements PostControllerDocs {

    private final PostService postService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostMessageResponseDTO> create(
            @RequestParam(required = false) String content,
            @RequestParam(required = false) Long idCommunity,
            @RequestParam(required = false, defaultValue = "PUBLICO") PostVisibility visibility,
            @RequestPart(required = false) List<MultipartFile> mediaFiles
    ) {
        PostRequestDTO dto = postService.processPostData(content, idCommunity, visibility, mediaFiles);
        PostResponseDTO postResponse = postService.create(dto);

        PostMessageResponseDTO response = new PostMessageResponseDTO("Postagem criada com sucesso.", postResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<MessageResponseDTO> delete(@PathVariable Long postId) {
        postService.delete(postId);
        return ResponseEntity.ok(new MessageResponseDTO("Postagem excluída com sucesso."));
    }

    @PatchMapping("/{postId}/visibility")
    public ResponseEntity<MessageResponseDTO> updateVisibility(
            @PathVariable Long postId,
            @RequestParam PostVisibility visibility
    ) {
        postService.updateVisibility(postId, visibility);
        return ResponseEntity.ok(new MessageResponseDTO("Visibilidade atualizada com sucesso."));
    }

    @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostMessageResponseDTO> editPost(
            @PathVariable Long postId,
            @RequestPart("data") @Valid PostEditRequestDTO data,
            @RequestPart(name = "newFiles", required = false) List<MultipartFile> newFiles
    ) {
        PostResponseDTO postResponse = postService.editPost(postId, data, newFiles);

        PostMessageResponseDTO response = new PostMessageResponseDTO("Postagem editada com sucesso.", postResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/timeline")
    public ResponseEntity<Page<UnifiedPostResponseDTO>> getTimelinePosts(@Valid PostFilterRequestDTO filter) {
        Page<UnifiedPostResponseDTO> posts = postService.getTimelinePosts(filter);
        return ResponseEntity.ok(posts);
    }
}
