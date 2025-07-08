package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record ExperienceTitleResponseDTO(

        @Schema(description = "ID do profissional", example = "123")
        Long id,

        @Schema(description = "Título do cargo ocupado", example = "Desenvolvedor Java")
        String title
) {}
