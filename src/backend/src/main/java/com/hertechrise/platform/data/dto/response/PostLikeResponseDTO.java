package com.hertechrise.platform.data.dto.response;

import com.hertechrise.platform.model.User;
import com.hertechrise.platform.model.UserType;
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
        LocalDateTime createdAt,

        @Schema(description = "Handle do usuário que curtiu", example = "@mariasouza")
        String userHandle,

        @Schema(description = "Tipo do perfil do usuário que curtiu", example = "PROFESSIONAL")
        UserType userType
) {
    public PostLikeResponseDTO(Long id, Long userId, String userName, String userAvatarUrl, LocalDateTime createdAt) {
        this(id, userId, userName, userAvatarUrl, createdAt, null, null);
    }

    public static PostLikeResponseDTO from(Long likeId, User user, LocalDateTime createdAt) {
        return new PostLikeResponseDTO(
                likeId,
                user.getId(),
                user.getName(),
                user.getProfilePic(),
                createdAt,
                user.getHandle(),
                user.getType()
        );
    }
}

