package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.PostControllerDocs;
import com.hertechrise.platform.data.dto.request.PostRequestDTO;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import com.hertechrise.platform.model.PostVisibility;
import com.hertechrise.platform.services.PostService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<MessageResponseDTO> create(
            @RequestParam(required = false) String content,
            @RequestParam(required = false) Long idCommunity,
            @RequestParam(required = false, defaultValue = "PUBLICO") PostVisibility visibility,
            @RequestPart(required = false) List<MultipartFile> mediaFiles
    ) {
        PostRequestDTO dto = postService.processPostData(content, idCommunity, visibility, mediaFiles);
        postService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponseDTO("Postagem criada com sucesso."));
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
}
