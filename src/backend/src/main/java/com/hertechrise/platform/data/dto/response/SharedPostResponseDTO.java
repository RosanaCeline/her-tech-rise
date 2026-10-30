package com.hertechrise.platform.data.dto.response;

import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.PostShare;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(name = "SharedPostResponseDTO", description = "DTO para postagens compartilhadas na plataforma")
public record SharedPostResponseDTO(

        @Schema(description = "ID do compartilhamento", example = "55")
        Long sharedId,

        @Schema(description = "Comentário do usuário ao compartilhar", example = "Achei esse post muito legal!")
        String sharedContent,

        @Schema(description = "Data e hora do compartilhamento", example = "2025-08-01T14:30:00", type = "string", format = "date-time")
        LocalDateTime sharedAt,

        @Schema(description = "Usuário que compartilhou o post")
        AuthorResponseDTO sharingUser,

        @Schema(description = "Dados do post original")
        PostResponseDTO originalPost,

        @Schema(description = "Quantidade de curtidas no compartilhamento", example = "58")
        Long countShareLikes,

        @Schema(description = "Quantidade de comentários no compartilhamento", example = "16")
        Long countShareComments,

        @Schema(description = "Se o usuário logado curtiu o compartilhamento", example = "false")
        Boolean likedByMe
) {
    public static SharedPostResponseDTO from(PostShare share, Long loggedUserId, boolean isFollowedOriginalAuthor, Boolean isFollowedSharer, Long countShareLikes, Long countShareComments) {
        return from(share, loggedUserId, isFollowedOriginalAuthor, isFollowedSharer, countShareLikes, countShareComments, null);
    }

    public static SharedPostResponseDTO from(PostShare share, Long loggedUserId, boolean isFollowedOriginalAuthor, Boolean isFollowedSharer, Long countShareLikes, Long countShareComments, Boolean likedByMe) {
        Post original = share.getPost();

        PostResponseDTO originalPost = PostResponseDTO.from(
                original,
                loggedUserId,
                isFollowedOriginalAuthor,
                null,
                null,
                null
        );

        AuthorResponseDTO sharingUser = AuthorResponseDTO.from(share.getUser(), isFollowedSharer);

        return new SharedPostResponseDTO(
                share.getId(),
                share.getContent(),
                share.getCreatedAt(),
                sharingUser,
                originalPost,
                countShareLikes,
                countShareComments,
                likedByMe
        );
    }
}
