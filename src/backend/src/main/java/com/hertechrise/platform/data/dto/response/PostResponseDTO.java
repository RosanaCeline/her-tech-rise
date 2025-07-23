package com.hertechrise.platform.data.dto.response;

import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.PostVisibility;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
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
        List<MediaResponseDTO> media,

        @Schema(description = "Visibilidade da postagem (PUBLICO ou PRIVADO)", example = "PUBLICO")
        PostVisibility visibility,

        @Schema(description = "Indica se a postagem foi editada", example = "true")
        boolean edited,

        @Schema(description = "Data e hora da última edição (ISO‑8601), ou null se nunca editado", example = "2025-07-08T10:15:30", type = "string", format = "date-time", nullable = true)
        LocalDateTime editedAt,

        @Schema(description = "Indica se essa publicação é do usuário logado", example = "true")
        boolean isOwner,

        @Schema(description = "Indica se essa publicação ainda pode ser editada", example = "true")
        boolean canEdit
) {
        public static PostResponseDTO from(Post post, Long loggedUserId) {
                boolean isOwner = post.getAuthor().getId().equals(loggedUserId);

                // Verifica se o post foi criado há no máximo 7 dias para permitir edição
                boolean canEdit = isOwner &&
                        ChronoUnit.DAYS.between(post.getCreatedAt(), LocalDateTime.now()) <= 7;

                List<MediaResponseDTO> mediaDtos = post.getMedia() != null
                        ? post.getMedia().stream().map(m -> new MediaResponseDTO(m.getId(), m.getMediaType(), m.getUrl())).toList()
                        : List.of();

                return new PostResponseDTO(
                        post.getId(),
                        post.getAuthor().getId(),
                        post.getContent(),
                        post.getCreatedAt(),
                        post.getCommunity() != null ? post.getCommunity().getId() : null,
                        mediaDtos,
                        post.getVisibility(),
                        post.isEdited(),
                        post.getEditedAt(),
                        isOwner,
                        canEdit
                );
        }
}
