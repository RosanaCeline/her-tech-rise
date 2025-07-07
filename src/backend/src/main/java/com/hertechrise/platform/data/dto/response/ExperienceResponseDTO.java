package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(name = "ExperienceResponseDTO", description = "Experiência profissional do usuário")
public record ExperienceResponseDTO(

        @Schema(description = "ID da experiência", example = "7")
        Long id,

        @Schema(description = "Título do cargo", example = "Desenvolvedora Java")
        String title,

        @Schema(description = "Empresa", example = "Tech Corp")
        String company,

        @Schema(description = "Modalidade de trabalho", example = "Remoto")
        String modality,

        @Schema(description = "Data de início", example = "2023-01-01", type = "string", format = "date")
        LocalDate startDate,

        @Schema(description = "Data de término (null se atual)", example = "2024-06-30", type = "string", format = "date")
        LocalDate endDate,

        @Schema(description = "Se é o trabalho atual", example = "true")
        boolean isCurrent,

        @Schema(description = "Descrição das atividades", example = "Backend em Spring Boot")
        String description
) {}
