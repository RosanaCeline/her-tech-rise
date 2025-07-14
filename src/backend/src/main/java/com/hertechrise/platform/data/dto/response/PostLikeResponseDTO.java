package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(name = "PostLikeResponseDTO", description = "DTO com informações sobre uma curtida em uma postagem")
public record PostLikeResponseDTO(

        @Schema(description = "ID da curtida", example = "101")
        Long id,

        @Schema(description = "ID do usuário que curtiu", example = "42")
        Long userId,

        @Schema(description = "Nome do usuário que curtiu", example = "Maria Souza")
        String userName,

        @Schema(description = "URL do avatar do usuário", example = "https://cdn.exemplo.com/avatars/maria.jpg")
        String userAvatarUrl,

        @Schema(description = "Data e hora da curtida", example = "2025-07-14T10:22:00", type = "string", format = "date-time")
        LocalDateTime createdAt
) {}

