package com.hertechrise.platform.data.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "UnfollowRequestDTO", description = "DTO para deixar de seguir usuários na plataforma")
public record UnfollowRequestDTO (
    @Schema(description = "Id do usuário que será não será mais seguido", example = "11")
    @NotNull(message = "ID é obrigatório.")
    Long id
) {}
