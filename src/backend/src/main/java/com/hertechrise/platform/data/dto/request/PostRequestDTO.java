package com.hertechrise.platform.data.dto.request;

import com.hertechrise.platform.model.PostVisibility;
import com.hertechrise.platform.validation.annotations.ContentOrMediaRequired;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

import java.util.List;

@ContentOrMediaRequired
@Schema(name = "PostRequestDTO", description = "DTO para fazer uma postagem na plataforma")
public record PostRequestDTO(

        @Schema(description = "Conteúdo da postagem, máximo 3000 caracteres", example = "Esta é minha primeira postagem!")
        @Size(max = 3000, message = "Conteúdo até 3000 caracteres.")
        String content,

        @Schema(
                description = "ID da comunidade onde a postagem será publicada (pode ser nula se não for em uma comunidade)",
                example = "15",
                nullable = true
        )
        Long idCommunity,

        @Schema(description = "Visibilidade da postagem (pode ser PUBLICO ou PRIVADO)", example = "PUBLICO")
        PostVisibility visibility,

        @Schema(description = "Lista de mídias associadas à postagem (máximo 10 itens)")
        @Size(max = 10, message = "Máx. 10 itens de mídia.")
        List<MediaRequestDTO> media
) {}