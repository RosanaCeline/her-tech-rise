package com.hertechrise.platform.data.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Filtros e configurações para listagem de postagens")
public record PostFilterRequestDTO(

        @Schema(description = "Status da postagem: 'ativo', 'inativo' ou ''. Opcional.",
                example = "ativo"
        )
        String status,

        @Schema(
                description = "Campo para ordenação. Padrão: 'createdAt'.",
                example = "createdAt",
                defaultValue = "createdAt"
        )
        String orderBy,

        @Schema(
                description = "Direção da ordenação: 'ASC' ou 'DESC'. Padrão: 'DESC'.",
                example = "DESC",
                defaultValue = "DESC"
        )
        String direction,

        @Schema(
                description = "Número da página (começa em 0). Padrão: 0.",
                example = "0",
                defaultValue = "0"
        )
        Integer page,

        @Schema(
                description = "Quantidade de elementos por página. Padrão: 10.",
                example = "10",
                defaultValue = "10"
        )
        Integer size

) {
    // Valores padrão para quando não forem informados no request
    public String orderBy() {
        return orderBy == null ? "createdAt" : orderBy;
    }

    public String direction() {
        return direction == null ? "DESC" : direction.toUpperCase();
    }

    public int page() {
        return page == null ? 0 : page;
    }

    public int size() {
        return size == null ? 10 : size;
    }
}

