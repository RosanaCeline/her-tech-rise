package com.hertechrise.platform.data.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "ConfirmedResetPasswordRequestDTO", description = "DTO para confirmar redefinição de senha")
public record ConfirmedResetPasswordRequestDTO(

        @Schema(description = "Token recebido por e-mail para validar a redefinição", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        @NotBlank(message = "token é obrigatório.")
        String token,

        @Schema(description = "Nova senha do usuário", example = "novaSenhaSegura123")
        @NotBlank(message = "Senha é obrigatória.")
        String newPassword
) {}
