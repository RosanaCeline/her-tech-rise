package com.hertechrise.platform.data.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostCommentRequestDTO(
        @NotBlank(message = "Comentário não pode ser vazio")
        @Size(max = 3000, message = "Comentário até 3000 caracteres")
        String content,

        Long parentCommentId
) {}
