package com.hertechrise.platform.data.dto.request;

import jakarta.validation.constraints.Size;

public record PostShareRequestDTO(
        @Size(max = 3000, message = "Compartilhamento até 3000 caracteres")
        String content
) {}

