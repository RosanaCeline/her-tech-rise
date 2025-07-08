package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(name = "PostResponseDTO", description = "DTO para postagem na plataforma")
public record PostResponseDTO(

        @Schema(description = "ID do post", example = "42")
        Long id,

        @Schema(description = "ID do autor", example = "123")
        Long idAuthor,

        @Schema(description = "Conteúdo textual do post", example = "Oi pessoal, esse é meu primeiro post!")
        String content,

        @Schema(description = "Data e hora de criação (ISO‑8601)", example = "2025-07-07T14:30:00", type = "string", format = "date-time")
        LocalDateTime createdAt,

        @Schema(description = "ID da comunidade onde o post foi publicado", example = "5")
        Long idCommunity,

        @ArraySchema(
                schema = @Schema(implementation = MediaResponseDTO.class)
        )
        @Schema(description = "Lista de mídias anexadas ao post")
        List<MediaResponseDTO> media
) {}