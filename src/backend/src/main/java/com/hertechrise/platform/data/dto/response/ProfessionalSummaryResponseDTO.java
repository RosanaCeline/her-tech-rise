package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resumo de informações de um profissional")
public record ProfessionalSummaryResponseDTO(
        @Schema(description = "ID do profissional", example = "1")
        Long id,

        @Schema(description = "Nome completo do profissional", example = "Ana Silva")
        String name,

        @Schema(description = "Nome de usuário (handle)", example = "@anadev")
        String handle,

        @Schema(description = "Tecnologias ou stack principal", example = "HTML | CSS | JavaScript | React")
        String technology,

        @Schema(description = "Quantidade de seguidores do profissional", example = "25")
        Long followersCount,

        @Schema(description = "Cidade", example = "Tianguá")
        String city,

        @Schema(description = "UF", example = "Ceará")
        String uf,

        @Schema(description = "URL da foto de perfil do profissional", example = "https://res.cloudinary.com/xyz/image/upload/v123456/user_1.png")
        String profilePic
) {}