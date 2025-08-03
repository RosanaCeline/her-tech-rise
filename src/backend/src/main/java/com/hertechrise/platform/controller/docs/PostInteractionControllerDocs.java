package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.request.PostCommentRequestDTO;
import com.hertechrise.platform.data.dto.request.PostShareRequestDTO;
import com.hertechrise.platform.data.dto.response.PostCommentResponseDTO;
import com.hertechrise.platform.data.dto.response.PostLikeResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Interações", description = "Endpoints para interações em postagens na plataforma")
public interface PostInteractionControllerDocs {

    @Operation(
            summary = "Curtir ou descurtir uma postagem",
            description = "Alterna entre curtir e descurtir a postagem com o ID fornecido."
    )
    @ApiResponse(responseCode = "200", description = "Interação registrada com sucesso")
    @PostMapping("/{postId}/like")
    ResponseEntity<Void> toggleLike(
            @Parameter(description = "ID da postagem") @PathVariable Long postId
    );

    @Operation(
            summary = "Listar usuários que curtiram uma postagem",
            description = "Retorna a lista de usuários que curtiram a postagem com o ID fornecido."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Lista de curtidas retornada com sucesso",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PostLikeResponseDTO.class))
    )
    @GetMapping("/{postId}/likes")
    ResponseEntity<List<PostLikeResponseDTO>> listLikes(
            @Parameter(description = "ID da postagem") @PathVariable Long postId
    );

    @Operation(
            summary = "Comentar em uma postagem",
            description = "Adiciona um novo comentário à postagem."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Comentário adicionado com sucesso",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PostCommentResponseDTO.class))
    )
    @PostMapping("/{postId}/comment")
    ResponseEntity<PostCommentResponseDTO> comment(
            @Parameter(description = "ID da postagem") @PathVariable Long postId,
            @RequestBody PostCommentRequestDTO dto
    );

    @Operation(
            summary = "Curtir ou descurtir um comentário",
            description = "Alterna entre curtir e descurtir o comentário com o ID fornecido."
    )
    @ApiResponse(responseCode = "200", description = "Interação registrada com sucesso")
    @PostMapping("/comment/{commentId}/like")
    ResponseEntity<Void> toggleCommentLike(
            @Parameter(description = "ID do comentário") @PathVariable Long commentId
    );

    @Operation(
            summary = "Listar comentários de uma postagem",
            description = "Retorna todos os comentários associados à postagem."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Lista de comentários retornada com sucesso",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PostCommentResponseDTO.class))
    )
    @GetMapping("/{postId}/comments")
    ResponseEntity<List<PostCommentResponseDTO>> listComments(
            @Parameter(description = "ID da postagem") @PathVariable Long postId
    );

    @Operation(
            summary = "Listar usuários que curtiram um comentário",
            description = "Retorna a lista de usuários que curtiram o comentário com o ID fornecido."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Lista de curtidas retornada com sucesso",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PostLikeResponseDTO.class))
    )
    @GetMapping("/comment/{commentId}/likes")
    ResponseEntity<List<PostLikeResponseDTO>> listCommentLikes(
            @Parameter(description = "ID do comentário") @PathVariable Long commentId
    );

    @Operation(
            summary = "Excluir um comentário",
            description = "Remove o comentário com o ID fornecido, se for do usuário autenticado."
    )
    @ApiResponse(responseCode = "204", description = "Comentário excluído com sucesso")
    @DeleteMapping("/comment/{commentId}")
    ResponseEntity<Void> deleteComment(
            @Parameter(description = "ID do comentário a ser removido") @PathVariable Long commentId
    );

    @Operation(
            summary = "Compartilhar uma postagem",
            description = "Permite que o usuário compartilhe a postagem com um conteúdo opcional."
    )
    @ApiResponse(responseCode = "200", description = "Compartilhamento realizado com sucesso")
    @PostMapping("/{postId}/share")
    ResponseEntity<Void> share(
            @Parameter(description = "ID da postagem") @PathVariable Long postId,
            @RequestBody PostShareRequestDTO dto
    );

    @Operation(
            summary = "Curtir ou descurtir um compartilhamento",
            description = "Alterna entre curtir e descurtir o compartilhamento com o ID fornecido."
    )
    @ApiResponse(responseCode = "200", description = "Interação registrada com sucesso")
    @PostMapping("/share/{shareId}/like")
    ResponseEntity<Void> toggleShareLike(
            @Parameter(description = "ID do compartilhamento") @PathVariable Long shareId
    );

    @Operation(
            summary = "Comentar em um compartilhamento",
            description = "Adiciona um novo comentário ao compartilhamento."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Comentário adicionado com sucesso",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PostCommentResponseDTO.class))
    )
    @PostMapping("/share/{shareId}/comment")
    ResponseEntity<PostCommentResponseDTO> shareComment(
            @Parameter(description = "ID do compartilhamento") @PathVariable Long shareId,
            @RequestBody PostCommentRequestDTO dto
    );

    @Operation(
            summary = "Listar usuários que curtiram um compartilhamento",
            description = "Retorna a lista de usuários que curtiram o compartilhamento com o ID fornecido."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Lista de curtidas retornada com sucesso",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PostLikeResponseDTO.class))
    )
    @GetMapping("/share/{shareId}/likes")
    ResponseEntity<List<PostLikeResponseDTO>> listShareLikes(
            @Parameter(description = "ID do compartilhamento") @PathVariable Long shareId
    );

    @Operation(
            summary = "Listar comentários de um compartilhamento",
            description = "Retorna todos os comentários associados ao compartilhamento."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Lista de comentários retornada com sucesso",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PostCommentResponseDTO.class))
    )
    @GetMapping("/share/{shareId}/comments")
    ResponseEntity<List<PostCommentResponseDTO>> listShareComments(
            @Parameter(description = "ID do compartilhamento") @PathVariable Long shareId
    );

    @Operation(
            summary = "Excluir um compartilhamento",
            description = "Remove o compartilhamento com o ID fornecido, se for do usuário autenticado."
    )
    @ApiResponse(responseCode = "204", description = "Compartilhamento removido com sucesso")
    @DeleteMapping("/share/{shareId}")
    ResponseEntity<Void> deleteShare(
            @Parameter(description = "ID do compartilhamento") @PathVariable Long shareId
    );
}
