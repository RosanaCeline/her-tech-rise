package com.hertechrise.platform.data.dto.response;

import java.time.LocalDateTime;

import com.hertechrise.platform.model.PostComment;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.model.UserType;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "PostCommentResponseDTO", description = "DTO de resposta para comentários em uma postagem")
public record PostCommentResponseDTO(

        @Schema(description = "ID do comentário", example = "101")
        Long id,

        @Schema(description = "ID do usuário autor do comentário", example = "42")
        Long userId,

        @Schema(description = "Nome do usuário autor do comentário", example = "Ana Silva")
        String userName,

        @Schema(description = "URL da foto de perfil do usuário", example = "https://meusite.com/perfil/ana.jpg")
        String userAvatarUrl,

        @Schema(description = "Conteúdo textual do comentário", example = "Concordo totalmente com o que você disse!")
        String content,

        @Schema(description = "Indica se o comentário foi editado", example = "true")
        boolean edited,

        @Schema(description = "Data e hora em que o comentário foi criado (formato ISO‑8601)", example = "2025-07-14T10:30:00")
        LocalDateTime createdAt,

        @Schema(description = "ID do comentário pai", example = "41")
        Long parentComment,

        @Schema(description = "Quantidade de curtidas no comentário", example = "17")
        Long countCommentLikes,

        @Schema(description = "Handle do autor do comentário", example = "@anasilva")
        String userHandle,

        @Schema(description = "Tipo do perfil do autor do comentário", example = "PROFESSIONAL")
        UserType userType,

        @Schema(description = "Se o usuário logado curtiu o comentário", example = "false")
        Boolean likedByMe
) {
    public PostCommentResponseDTO(Long id, Long userId, String userName, String userAvatarUrl, String content,
                                  boolean edited, LocalDateTime createdAt, Long parentComment, Long countCommentLikes) {
        this(id, userId, userName, userAvatarUrl, content, edited, createdAt, parentComment, countCommentLikes,
                null, null, null);
    }

    public static PostCommentResponseDTO from(PostComment comment, Long countCommentLikes, Boolean likedByMe) {
        User user = comment.getUser();
        return new PostCommentResponseDTO(
                comment.getId(),
                user.getId(),
                user.getName(),
                user.getProfilePic(),
                comment.getContent(),
                comment.isEdited(),
                comment.getCreatedAt(),
                comment.getParentComment() != null ? comment.getParentComment().getId() : null,
                countCommentLikes,
                user.getHandle(),
                user.getType(),
                likedByMe
        );
    }
}

