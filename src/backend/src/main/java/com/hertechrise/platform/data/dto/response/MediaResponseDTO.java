package com.hertechrise.platform.data.dto.response;


import com.hertechrise.platform.model.Media;
import com.hertechrise.platform.model.MediaType;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MediaResponseDTO", description = "DTO para mídia anexada a um post")
public record MediaResponseDTO(

        @Schema(description = "ID da mídia", example = "100")
        Long id,

        @Schema(description = "Tipo da mídia", example = "IMAGE")
        MediaType mediaType,

        @Schema(description = "URL da mídia", example = "https://res.cloudinary.com/demo/image/upload/v123456/photo.png")
        String url
) {}
