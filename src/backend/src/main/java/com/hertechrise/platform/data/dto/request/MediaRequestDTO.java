package com.hertechrise.platform.data.dto.request;

import com.hertechrise.platform.model.MediaType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.URL;

@Schema(name = "MediaRequestDTO", description = "DTO para incluir uma mídia em postagens")
public record MediaRequestDTO(

        @NotNull(message = "Tipo da mídia é obrigatório.")
        @Schema(description = "Tipo da mídia", example = "IMAGE")
        MediaType mediaType,

        @NotBlank
        @Pattern(
                regexp = "^(image|video|application)/.+$",
                message = "MIME inválido.")
        @Schema(description = "MIME type da mídia", example = "image/png")
        String mimeType,

        @NotBlank
        @URL(message = "URL da mídia é inválida.")
        @Schema(description = "URL onde a mídia está hospedada", example = "https://meusite.com/imagens/foto1.png")
        String url
) {}