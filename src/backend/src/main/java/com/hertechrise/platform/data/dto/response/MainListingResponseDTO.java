package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Resposta principal contendo listagens separadas de profissionais e empresas")
public record MainListingResponseDTO(

        @Schema(description = "Lista de profissionais encontrados")
        List<UserSummaryResponseDTO> professionals,

        @Schema(description = "Lista de empresas encontradas")
        List<UserSummaryResponseDTO> companies
) {}