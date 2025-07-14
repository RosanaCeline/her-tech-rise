package com.hertechrise.platform.data.dto.request;

import com.hertechrise.platform.model.PostVisibility;
import com.hertechrise.platform.validation.annotations.ContentOrMediaRequired;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

@ContentOrMediaRequired
@Schema(name = "PostEditRequestDTO", description = "DTO para edição de postagens na plataforma")
public record PostEditRequestDTO(

        @Schema(description = "Conteúdo da postagem, máximo 3000 caracteres", example = "Esta é minha postagem atualizada!")
        @Size(max = 3000, message = "Conteúdo até 3000 caracteres.")
        String content,

        @Schema(description = "Visibilidade da postagem (pode ser PUBLICO ou PRIVADO)", example = "PUBLICO")
        @NotNull(message = "Visibilidade é obrigatória.")
        PostVisibility visibility,

        @Schema(description = "Lista de mídias antigas e novas associadas à postagem (máximo 10 itens)")
        @Size(max = 10, message = "Máx. 10 itens de mídia.")
        @Valid
        List<MediaEditRequestDTO> medias
) {}
