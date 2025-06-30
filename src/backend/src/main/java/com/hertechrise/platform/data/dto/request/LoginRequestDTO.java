package com.hertechrise.platform.data.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "LoginRequestDTO", description = "DTO para login de usuários na plataforma")
public record LoginRequestDTO (

        @Schema(description = "Email de login do usuário", example = "exemplo@empresa.com")
        @NotBlank(message = "Email é obrigatório.")
        @Email(message = "Email inválido.")
        String email,

        @Schema(description = "Senha do usuário", example = "minhaSenha123")
        @NotBlank(message = "Senha é obrigatória.")
        String password
) {}
