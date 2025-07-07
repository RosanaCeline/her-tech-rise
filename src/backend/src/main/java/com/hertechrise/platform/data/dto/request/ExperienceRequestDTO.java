package com.hertechrise.platform.data.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(name = "ExperienceRequestDTO", description = "DTO para requisição de experiência profissional")
public record ExperienceRequestDTO(

        @Schema(description = "ID da experiência (pode ser nulo para nova experiência)", example = "1", nullable = true)
        Long id,

        @Schema(description = "Título do cargo ocupado", example = "Desenvolvedor Java")
        String title,

        @Schema(description = "Nome da empresa", example = "Tech Solutions")
        String company,

        @Schema(description = "Modalidade do trabalho", example = "Presencial")
        String modality,

        @Schema(description = "Data de início da experiência (formato yyyy-MM-dd)", example = "2018-01-01", type = "string", format = "date")
        LocalDate startDate,

        @Schema(description = "Data de término da experiência (formato yyyy-MM-dd), pode ser nulo se atualmente ativo", example = "2022-06-30", type = "string", format = "date", nullable = true)
        LocalDate endDate,

        @Schema(description = "Indica se a experiência está em andamento", example = "false")
        boolean isCurrent,

        @Schema(description = "Descrição detalhada da experiência", example = "Desenvolvimento de sistemas bancários e automação de processos.")
        String description
) {}