package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(name = "PostShareResponseDTO", description = "DTO de resposta para compartilhamentos de postagens")
public record PostShareResponseDTO(

        @Schema(description = "ID do compartilhamento", example = "501")
        Long id,

        @Schema(description = "ID do usuário que compartilhou o post", example = "42")
        Long userId,

        @Schema(description = "Nome do usuário que compartilhou o post", example = "João Oliveira")
        String userName,

        @Schema(description = "URL da foto de perfil do usuário", example = "https://meusite.com/perfil/joao.jpg")
        String userAvatarUrl,

        @Schema(description = "Texto opcional inserido no momento do compartilhamento", example = "Achei esse post muito relevante!")
        String content,

        @Schema(description = "Data e hora do compartilhamento (formato ISO‑8601)", example = "2025-07-14T14:45:00")
        LocalDateTime createdAt
) {}
