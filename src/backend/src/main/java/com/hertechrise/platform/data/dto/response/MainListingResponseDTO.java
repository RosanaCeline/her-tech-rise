package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "MainListingResponseDTO", description = "Resposta principal contendo listagens separadas de profissionais e empresas")
public record MainListingResponseDTO(

        @Schema(description = "Lista de profissionais encontrados")
        List<ProfessionalSummaryResponseDTO> professionals,

        @Schema(description = "Lista de empresas encontradas")
        List<CompanySummaryResponseDTO> companies
) {}