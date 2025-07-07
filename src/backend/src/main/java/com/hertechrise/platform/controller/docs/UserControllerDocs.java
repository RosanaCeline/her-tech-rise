package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.response.UserPictureResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Usuário", description = "Endpoints genéricos de usuário")
public interface UserControllerDocs {

    @Operation(
            summary = "Atualizar foto de perfil do usuário",
            description = "Recebe um arquivo de imagem e atualiza a foto de perfil do usuário autenticado.",
            requestBody = @RequestBody(
                    description = "Arquivo da nova foto de perfil",
                    required = true,
                    content = @Content(
                            mediaType = "multipart/form-data",
                            schema = @Schema(type = "string", format = "binary")
                    )
            ),
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Foto de perfil atualizada com sucesso",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = UserPictureResponseDTO.class)
                            )
                    ),
                    @ApiResponse(responseCode = "400", description = "Arquivo inválido ou erro na requisição"),
                    @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
            }
    )
    ResponseEntity<UserPictureResponseDTO> updateProfilePicture(MultipartFile file);
}
