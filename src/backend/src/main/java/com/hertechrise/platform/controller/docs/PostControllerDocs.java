package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import com.hertechrise.platform.data.dto.response.PostResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Postagem", description = "Endpoints para postagens na plataforma")
public interface PostControllerDocs {

    @Operation(
            summary = "Criar uma nova postagem",
            description = "Permite ao usuário autenticado criar uma nova postagem com ou sem mídias."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Postagem criada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponseDTO.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Requisição inválida")
    })
    ResponseEntity<MessageResponseDTO> create(
            @Parameter(
                    description = "Conteúdo textual do post",
                    required = false,
                    example = "Oi, esse é meu post!"
            ) @RequestPart("content") String content,

            @Parameter(
                    description = "ID da comunidade (opcional)",
                    example = "5"
            ) @RequestPart(value = "idCommunity", required = false) Long idCommunity,

            @Parameter(
                    description = "Arquivos de mídia (imagem, vídeo ou documento)",
                    required = false
            ) @RequestPart(value = "mediaFiles", required = false) List<MultipartFile> mediaFiles
    );
}
