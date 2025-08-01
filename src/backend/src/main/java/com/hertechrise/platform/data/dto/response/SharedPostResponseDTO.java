package com.hertechrise.platform.data.dto.response;

import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.PostShare;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(name = "SharedPostResponseDTO", description = "DTO para postagens compartilhadas na plataforma")
public record SharedPostResponseDTO(

        @Schema(description = "ID do post compartilhado", example = "55")
        Long id,

        @Schema(description = "Comentário do usuário ao compartilhar", example = "Achei esse post muito legal!")
        String sharedContent,

        @Schema(description = "Data e hora do compartilhamento", example = "2025-08-01T14:30:00", type = "string", format = "date-time")
        LocalDateTime sharedAt,

        @Schema(description = "Usuário que compartilhou o post")
        AuthorResponseDTO sharingUser,

        @Schema(description = "Dados do post original")
        PostResponseDTO originalPost
) {
    public static SharedPostResponseDTO from(PostShare share, Long loggedUserId, boolean isFollowedOriginalAuthor, Boolean isFollowedSharer) {
        Post original = share.getPost();

        PostResponseDTO originalPost = PostResponseDTO.from(original, loggedUserId, isFollowedOriginalAuthor);

        AuthorResponseDTO sharingUser = new AuthorResponseDTO(
                share.getUser().getId(),
                share.getUser().getName(),
                share.getUser().getHandle(),
                share.getUser().getProfilePic(),
                isFollowedSharer
        );

        return new SharedPostResponseDTO(
                original.getId(),
                share.getContent(),
                share.getCreatedAt(),
                sharingUser,
                originalPost
        );
    }
}
