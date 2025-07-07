package com.hertechrise.platform.data.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(name = "FollowResponseDTO", description = "DTO para resposta ao seguir um usuário")
public record FollowResponseDTO(

        @Schema(description = "ID da relação de follow", example = "123")
        Long id,

        @Schema(description = "ID do usuário que está seguindo", example = "5")
        Long followerId,

        @Schema(description = "ID do usuário que está sendo seguido", example = "10")
        Long followingId,

        @JsonFormat(shape = JsonFormat.Shape.STRING,
                pattern = "dd/MM/yyyy HH:mm",
                timezone = "America/Sao_Paulo")
        @Schema(
                description = "Data e hora do follow (formato brasileiro)",
                example = "07/07/2025 14:30"
        )
        LocalDateTime followedAt
) {}
