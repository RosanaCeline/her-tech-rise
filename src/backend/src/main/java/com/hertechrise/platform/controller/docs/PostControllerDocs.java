package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.request.PostEditRequestDTO;
import com.hertechrise.platform.data.dto.request.PostFilterRequestDTO;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import com.hertechrise.platform.data.dto.response.PostMessageResponseDTO;
import com.hertechrise.platform.data.dto.response.PostResponseDTO;
import com.hertechrise.platform.data.dto.response.UnifiedPostResponseDTO;
import com.hertechrise.platform.model.PostVisibility;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Postagem", description = "Endpoints para postagens na plataforma")
public interface PostControllerDocs {

    @Operation(summary = "Criar uma nova postagem",
            description = "Permite ao usuário autenticado criar uma nova postagem com ou sem mídias. " +
                    "A visibilidade pode ser definida como PUBLICO ou PRIVADO.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Postagem criada com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = PostMessageResponseDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Requisição inválida")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<PostMessageResponseDTO> create(

            @Parameter(
                    description = "Conteúdo textual do post (opcional)",
                    example = "Oi, esse é meu post!"
            )
            @RequestParam(required = false)
            String content,

            @Parameter(
                    description = "ID da comunidade (opcional)",
                    example = "5"
            )
            @RequestParam(required = false)
            Long idCommunity,

            @Parameter(
                    description = "Visibilidade do post (PUBLICO ou PRIVADO). Padrão: PUBLICO",
                    example = "PUBLICO"
            )
            @RequestParam(required = false, defaultValue = "PUBLICO")
            PostVisibility visibility,

            @Parameter(
                    description = "Arquivos de mídia (imagem, vídeo ou documento) a serem anexados",
                    required = false
            )
            @RequestPart(required = false)
            List<MultipartFile> mediaFiles
    );

    @Operation(
            summary = "Excluir uma postagem",
            description = "Marca uma postagem como excluída logicamente. Somente o autor pode excluir."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Postagem excluída com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário não autorizado"),
            @ApiResponse(responseCode = "404", description = "Postagem não encontrada")
    })
    @DeleteMapping("/{postId}")
    ResponseEntity<MessageResponseDTO> delete(
            @Parameter(description = "ID da postagem a ser excluída", example = "42")
            @PathVariable Long postId
    );

    @Operation(
            summary = "Alterar visibilidade de uma postagem",
            description = "Permite ao autor da postagem mudar a visibilidade para PUBLICO ou PRIVADO."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Visibilidade atualizada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário não autorizado"),
            @ApiResponse(responseCode = "404", description = "Postagem não encontrada")
    })
    @PatchMapping("/{postId}/visibility")
    ResponseEntity<MessageResponseDTO> updateVisibility(
            @Parameter(description = "ID da postagem", example = "42")
            @PathVariable Long postId,

            @Parameter(description = "Nova visibilidade (PUBLICO ou PRIVADO)", example = "PRIVADO")
            @RequestParam PostVisibility visibility
    );

    @Operation(
            summary = "Editar uma postagem existente",
            description = "Permite ao usuário autenticado editar o conteúdo, visibilidade e anexos de uma postagem. " +
                    "O usuário deve ser o autor do post para poder editar."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Postagem editada com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = PostMessageResponseDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "403", description = "Usuário não autorizado a editar esta postagem"),
            @ApiResponse(responseCode = "404", description = "Postagem não encontrada")
    })
    @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<PostMessageResponseDTO> editPost(
            @Parameter(description = "ID da postagem", required = true, example = "42")
            @PathVariable Long postId,

            @Parameter(description = "Dados para edição do post")
            @Valid @ModelAttribute PostEditRequestDTO request
    );

    @Operation(
            summary = "Buscar postagens para a timeline",
            description = "Retorna uma lista paginada de postagens públicas com base nos filtros fornecidos. Usado para montar a timeline geral da plataforma."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Postagens recuperadas com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = PostResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Parâmetros inválidos", content = @Content),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor", content = @Content)
    })
    @GetMapping("/timeline")
    ResponseEntity<Page<UnifiedPostResponseDTO>> getTimelinePosts(@Valid PostFilterRequestDTO filter);

}
