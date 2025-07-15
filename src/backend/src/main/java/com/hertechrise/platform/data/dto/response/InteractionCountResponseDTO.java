package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InteractionCountResponseDTO", description = "DTO para quantidade de cada interação de um post")
public record InteractionCountResponseDTO(

        @Schema(description = "Quantidade de curtidas", example = "35")
        long likes,

        @Schema(description = "Quantidade de comentários", example = "12")
        long comments,

        @Schema(description = "Quantidade de compartilhamentos", example = "8")
        long shares
) {}
