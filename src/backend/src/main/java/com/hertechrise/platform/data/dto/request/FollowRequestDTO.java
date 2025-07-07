package com.hertechrise.platform.data.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "FollowRequestDTO", description = "DTO para seguir usuários na plataforma")
public record FollowRequestDTO(
        @Schema(description = "Id do usuário que será seguido", example = "2")
        @NotNull(message = "ID é obrigatório.")
        Long id
) {}
