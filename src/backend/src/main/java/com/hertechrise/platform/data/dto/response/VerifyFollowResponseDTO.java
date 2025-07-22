package com.hertechrise.platform.data.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(name = "VerifyFollowResponseDTO", description = "DTO para verificar se o usuário autenticado segue outro usuário")
public record VerifyFollowResponseDTO(

        @Schema(description = "Resultado se o usuário autenticado segue outro usuário", example = "True")
        boolean isFollowing
) {}
