package com.hertechrise.platform.data.dto.response;

import com.hertechrise.platform.model.PostVisibility;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(name = "UserPostSummaryResponseDTO", description = "Resumo da publicação de um usuário")
public record UserPostSummaryResponseDTO(

        @Schema(description = "ID da publicação", example = "42")
        Long id,

        @Schema(description = "Conteúdo textual da publicação", example = "Exemplo de post")
        String content,

        @Schema(description = "Data e hora da criação (ISO 8601)", example = "2025-07-14T15:00:00")
        LocalDateTime createdAt,

        @Schema(description = "Status da publicação", example = "PUBLICO")
        PostVisibility visibility,

        @Schema(description = "Quantidade de curtidas", example = "10")
        Long likeCount,

        @Schema(description = "Quantidade de comentários", example = "5")
        Long commentCount,

        @Schema(description = "Quantidade de compartilhamentos", example = "2")
        Long shareCount,

        @Schema(description = "Lista de URLs das mídias anexadas")
        List<String> mediaUrls

) {}