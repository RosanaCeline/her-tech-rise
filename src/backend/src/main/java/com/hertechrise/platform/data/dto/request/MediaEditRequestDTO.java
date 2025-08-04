package com.hertechrise.platform.data.dto.request;

import com.hertechrise.platform.model.MediaType;
import jakarta.validation.constraints.NotNull;

public record MediaEditRequestDTO(

        @NotNull(message = "ID da mídia antiga é obrigatório.")
        Long id,

        @NotNull(message = "Tipo da mídia antiga é obrigatório.")
        MediaType mediaType,

        @NotNull(message = "URL da mídia antiga é obrigatório")
        String url
) {}
