package com.hertechrise.platform.data.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(name = "PostShareRequestDTO", description = "DTO para compartilhamento de postagens")
public record PostShareRequestDTO(

        @Size(max = 3000, message = "Compartilhamento até 3000 caracteres")
        @Pattern(regexp = "^(?!\\s*$).+", message = "O conteúdo não pode conter apenas espaços em branco")
        @Schema(description = "Texto opcional do compartilhamento", example = "Achei esse post muito interessante!")
        String content
) {}

