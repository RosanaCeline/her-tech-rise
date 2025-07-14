package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "TokenResponseDTO", description = "DTO com token JWT retornado após autenticação")
public record TokenResponseDTO(

        @Schema(description = "Nome do usuário autenticado", example = "Ana Clara")
        String name,

        @Schema(description = "ID do usuário autenticado", example = "12")
        Long id,

        @Schema(description = "Token JWT", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        String token,

        @Schema(description = "Papel/perfil do usuário", example = "PROFESSIONAL")
        String role,

        @Schema(description = "URL da foto de perfil do usuário", example = "https://res.cloudinary.com/xyz/image/upload/v123456/ana_clara.png")
        String profilePicture
) {}
