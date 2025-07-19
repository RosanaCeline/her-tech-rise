package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resumo de informações de um usuário (profissional ou empresa)")
public record UserSummaryResponseDTO(

        @Schema(description = "ID do usuário", example = "1")
        Long id,

        @Schema(description = "Nome completo do usuário", example = "Ana Silva")
        String name,

        @Schema(description = "Nome de usuário (handle)", example = "@anadev")
        String handle,

        @Schema(description = "Cidade", example = "São Paulo")
        String city,

        @Schema(description = "URL da foto de perfil do usuário", example = "https://res.cloudinary.com/xyz/image/upload/v123456/user_1.png")
        String profilePic
) {}
