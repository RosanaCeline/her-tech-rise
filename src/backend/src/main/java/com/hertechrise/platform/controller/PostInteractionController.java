package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.PostInteractionControllerDocs;
import com.hertechrise.platform.data.dto.request.PostCommentRequestDTO;
import com.hertechrise.platform.data.dto.request.PostShareRequestDTO;
import com.hertechrise.platform.data.dto.response.PostCommentResponseDTO;
import com.hertechrise.platform.data.dto.response.PostLikeResponseDTO;
import com.hertechrise.platform.services.PostInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
@Validated
public class PostInteractionController implements PostInteractionControllerDocs {

    private final PostInteractionService interactionService;

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> toggleLike(@PathVariable Long postId) {
        interactionService.toggleLike(postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}/likes")
    public ResponseEntity<List<PostLikeResponseDTO>> listLikes(@PathVariable Long postId) {
        return ResponseEntity.ok(interactionService.listLikes(postId));
    }

    @PostMapping("/{postId}/comment")
    public ResponseEntity<PostCommentResponseDTO> comment(
            @PathVariable Long postId,
            @RequestBody @Validated PostCommentRequestDTO dto
    ) {
        return ResponseEntity.ok(interactionService.comment(postId, dto));
    }

    @PostMapping("/comment/{commentId}/like")
    public ResponseEntity<Void> toggleCommentLike(@PathVariable Long commentId) {
        interactionService.toggleCommentLike(commentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<PostCommentResponseDTO>> listComments(@PathVariable Long postId) {
        return ResponseEntity.ok(interactionService.listComments(postId));
    }

    @GetMapping("/comment/{commentId}/likes")
    public ResponseEntity<List<PostLikeResponseDTO>> listCommentLikes(@PathVariable Long commentId) {
        return ResponseEntity.ok(interactionService.listCommentLikes(commentId));
    }

    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        interactionService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/share")
    public ResponseEntity<Void> share(
            @PathVariable Long postId,
            @RequestBody @Validated PostShareRequestDTO dto
    ) {
        interactionService.share(postId, dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/share/{shareId}/like")
    public ResponseEntity<Void> toggleShareLike(@PathVariable Long shareId) {
        interactionService.toggleShareLike(shareId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/share/{shareId}/comment")
    public ResponseEntity<PostCommentResponseDTO> shareComment(
            @PathVariable Long shareId,
            @RequestBody @Validated PostCommentRequestDTO dto
    ) {
        return ResponseEntity.ok(interactionService.commentOnShare(shareId, dto));
    }

    @GetMapping("/share/{shareId}/likes")
    public ResponseEntity<List<PostLikeResponseDTO>> listShareLikes(@PathVariable Long shareId) {
        return ResponseEntity.ok(interactionService.listShareLikes(shareId));
    }

    @GetMapping("/share/{shareId}/comments")
    public ResponseEntity<List<PostCommentResponseDTO>> listShareComments(@PathVariable Long shareId) {
        return ResponseEntity.ok(interactionService.listShareComments(shareId));
    }

    @DeleteMapping("/share/{shareId}")
    public ResponseEntity<Void> deleteShare(@PathVariable Long shareId) {
        interactionService.deleteShare(shareId);
        return ResponseEntity.noContent().build();
    }
}
