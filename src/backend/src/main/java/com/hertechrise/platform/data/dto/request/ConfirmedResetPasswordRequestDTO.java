package com.hertechrise.platform.data.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(name = "ConfirmedResetPasswordRequestDTO", description = "DTO para confirmar redefinição de senha")
public record ConfirmedResetPasswordRequestDTO(

        @Schema(description = "Token recebido por e-mail para validar a redefinição", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        @NotBlank(message = "token é obrigatório.")
        String token,

        @Schema(description = "Nova senha do usuário", example = "novaSenhaSegura123")
        @NotBlank(message = "Senha é obrigatória.")
        @Size(min = 6, max = 70, message = "Senha deve ter no mínimo 6 e no máximo 70 caracteres.")
        String newPassword
) {}
