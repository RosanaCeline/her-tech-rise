package com.hertechrise.platform.data.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;

@Schema(name = "PostFilterRequestDTO", description = "Filtros e configurações para listagem de postagens")
public record PostFilterRequestDTO(

        @Schema(description = "Número da página", example = "0", defaultValue = "0")
        Integer page,

        @Schema(description = "Tamanho da página", example = "10", defaultValue = "10")
        Integer size,

        @Schema(description = "Campo de ordenação", example = "createdAt")
        String orderBy,

        @Schema(description = "Direção de ordenação", example = "DESC")
        @Pattern(regexp = "ASC|DESC", message = "Direção de ordenação deve ser ASC ou DESC.")
        String direction
) {
    public Integer page() {
        return page == null ? 0 : page;
    }

    public Integer size() {
        return size == null ? 10 : size;
    }

    public String orderBy() {
        return orderBy == null ? "createdAt" : orderBy;
    }

    public String direction() {
        return direction == null ? "DESC" : direction.toUpperCase();
    }
}


