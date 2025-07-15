package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "PagedResponseDTO", description = "Resposta paginada para UserSummaryResponseDTO")
public record PagedResponseDTO<T>(
        @Schema(description = "Lista de itens da página", example = "[{...}, {...}]")
        List<T> content,

        @Schema(description = "Total de elementos disponíveis", example = "125")
        long totalElements,

        @Schema(description = "Número total de páginas", example = "7")
        int totalPages,

        @Schema(description = "Número da página atual (zero-based)", example = "0")
        int page,

        @Schema(description = "Tamanho da página", example = "20")
        int size,

        @Schema(description = "Indica se esta é a última página", example = "false")
        boolean last,

        @Schema(description = "Indica se esta é a primeira página", example = "true")
        boolean first
) {}