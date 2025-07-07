package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.request.PostRequestDTO;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

@Tag(name = "Postagem", description = "Endpoints para postagens na plataforma")
public interface PostControllerDocs {

    @Operation(
            summary = "Criar uma nova postagem",
            description = "Permite ao usuário autenticado criar uma nova postagem na plataforma.",
            requestBody = @RequestBody(
                    description = "Dados da postagem a ser criada",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = PostRequestDTO.class)
                    )
            ),
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Postagem criada com sucesso",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = MessageResponseDTO.class)
                            )
                    ),
                    @ApiResponse(responseCode = "400", description = "Requisição inválida")
            }
    )
    ResponseEntity<MessageResponseDTO> post(@Valid PostRequestDTO request);
}
