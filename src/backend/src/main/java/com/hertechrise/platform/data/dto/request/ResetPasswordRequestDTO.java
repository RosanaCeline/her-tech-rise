package com.hertechrise.platform.data.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "ResetPasswordRequestDTO", description = "DTO para solicitação de redefinição de senha")
public record ResetPasswordRequestDTO (

        @Schema(description = "Email do usuário para envio do link de redefinição", example = "usuario@exemplo.com")
        @NotBlank(message = "email é obrigatório.")
        String email
) {}
