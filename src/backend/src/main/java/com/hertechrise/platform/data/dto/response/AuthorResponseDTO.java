package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AuthorResponseDTO", description = "DTO para retornar o autor de uma publicação ou compartilhamento")
public record AuthorResponseDTO(

        @Schema(description = "ID do autor", example = "123")
        Long id,

        @Schema(description = "Nome do autor", example = "Rosana Celine")
        String name,

        @Schema(description = "Handle do autor", example = "@rosanaceline")
        String handle,

        @Schema(description = "Foto de perfil do autor", example = "https://res.cloudinary.com/demo/image/upload/v123456/author_profile.jpg")
        String profilePic,

        @Schema(description = "Se o usuário logado segue o autor do post", example = "true")
        Boolean isFollowed
) {}
