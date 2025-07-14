package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.PostInteractionControllerDocs;
import com.hertechrise.platform.data.dto.request.PostCommentRequestDTO;
import com.hertechrise.platform.data.dto.request.PostShareRequestDTO;
import com.hertechrise.platform.data.dto.response.InteractionCountResponseDTO;
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

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<PostCommentResponseDTO>> listComments(@PathVariable Long postId) {
        return ResponseEntity.ok(interactionService.listComments(postId));
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

    @DeleteMapping("/share/{shareId}")
    public ResponseEntity<Void> deleteShare(@PathVariable Long shareId) {
        interactionService.deleteShare(shareId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{postId}/interactions/count")
    public ResponseEntity<InteractionCountResponseDTO> getInteractionCounts(@PathVariable Long postId) {
        long likes = interactionService.countLikes(postId);
        long comments = interactionService.countComments(postId);
        long shares = interactionService.countShares(postId);
        return ResponseEntity.ok(new InteractionCountResponseDTO(likes, comments, shares));
    }
}
