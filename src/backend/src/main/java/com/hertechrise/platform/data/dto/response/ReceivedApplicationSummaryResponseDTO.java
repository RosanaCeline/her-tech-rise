package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(name = "ReceivedApplicationSummaryResponseDTO", description = "Resumo das informações de uma candidatura do ponto de vista da empresa")
public record ReceivedApplicationSummaryResponseDTO(

        @Schema(description = "ID da candidatura", example = "123")
        Long applicationId,

        @Schema(description = "ID do candidato", example = "56")
        Long applicantId,

        @Schema(description = "Nome completo do candidato", example = "João da Silva")
        String applicantName,

        @Schema(description = "Tecnologias ou stack principal do candidato", example = "Java | Spring Boot")
        String applicantTechnology,

        @Schema(description = "Telefone de contato do candidato", example = "(11) 91234-5678")
        String applicantPhone,

        @Schema(description = "Email do candidato", example = "joao.silva@email.com")
        String applicantEmail,

        @Schema(description = "Foto de perfil do candidato", example = "https://res.cloudinary.com/seuapp/user_56.png")
        String applicantProfilePic,

        @Schema(description = "Data da candidatura", example = "2024-07-15T10:20:30")
        LocalDateTime appliedAt
) {}