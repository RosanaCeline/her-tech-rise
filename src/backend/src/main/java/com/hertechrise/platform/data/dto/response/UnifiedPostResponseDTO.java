package com.hertechrise.platform.data.dto.response;

import com.hertechrise.platform.model.PostContentType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(name = "UnifiedPostResponseDTO", description = "DTO para listar postagens e compartilhamentos juntos")
public record UnifiedPostResponseDTO(

        @Schema(description = "Tipo da postagem (POSTAGEM ou COMPARTILHAMENTO)", example = "POSTAGEM")
        PostContentType type,

        @Schema(description = "Postagem normal")
        PostResponseDTO post,

        @Schema(description = "Compartilhamento de um post")
        SharedPostResponseDTO share,

        @Schema(description = "Data de criação para ordenação")
        LocalDateTime createdAt
) {}
