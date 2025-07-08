package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "UserPictureResponseDTO", description = "Resposta com dados do usuário e URL da foto de perfil")
public record UserPictureResponseDTO(

        @Schema(description = "ID do usuário", example = "123")
        Long id,

        @Schema(description = "Nome do usuário", example = "Maria Oliveira")
        String name,

        @Schema(description = "URL da foto de perfil do usuário", example = "https://res.cloudinary.com/xyz/image/upload/v123456/user_123.png")
        String profilePic
) {}
