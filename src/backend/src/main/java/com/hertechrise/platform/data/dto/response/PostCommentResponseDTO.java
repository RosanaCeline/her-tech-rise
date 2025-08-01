package com.hertechrise.platform.data.dto.response;

import java.time.LocalDateTime;

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
        Long countCommentLikes
) {}

