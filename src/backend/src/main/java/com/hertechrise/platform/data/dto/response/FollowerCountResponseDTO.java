package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "FollowerCountResponseDTO", description = "DTO que retorna a quantidade de seguidores e de seguindo de um usuário")
public record FollowerCountResponseDTO(

        @Schema(description = "Quantidade de seguidores", example = "12")
        long followers,

        @Schema(description = "Quantidade de seguindo", example = "32")
        long following
) {}

