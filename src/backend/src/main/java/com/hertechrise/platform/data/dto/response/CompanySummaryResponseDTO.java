package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resumo de informações de uma empresa")
public record CompanySummaryResponseDTO(

        @Schema(description = "ID da empresa", example = "2")
        Long id,

        @Schema(description = "Nome completo da empresa", example = "Mercado Livre")
        String name,

        @Schema(description = "Nome de usuário (handle)", example = "@mercadolivre")
        String handle,

        @Schema(description = "Quantidade de seguidores da empresa", example = "1002")
        Long followersCount,

        @Schema(description = "Cidade", example = "São José dos Campos")
        String city,

        @Schema(description = "UF", example = "São Paulo")
        String uf,

        @Schema(description = "URL da foto de perfil da empresa", example = "https://res.cloudinary.com/xyz/image/upload/v123456/user_1.png")
        String profilePic
) {}
