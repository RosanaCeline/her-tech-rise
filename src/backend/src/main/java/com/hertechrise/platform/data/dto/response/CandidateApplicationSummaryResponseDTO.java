package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(name = "CandidateApplicationSummaryResponseDTO", description = "Resumo das informações de uma candidatura do ponto de vista do candidato")
public record CandidateApplicationSummaryResponseDTO(

        @Schema(description = "ID da candidatura", example = "123")
        Long applicationId,

        @Schema(description = "ID da vaga", example = "23")
        Long jobId,

        @Schema(description = "Título da vaga para a qual o candidato aplicou", example = "Desenvolvedor Backend Java")
        String jobTitle,

        @Schema(description = "Data em que se candidatou para a vaga", example = "2002-04-30")
        LocalDateTime appliedAt,

        @Schema(description = "Prazo de inscrição para a vaga", example = "2002-05-01")
        LocalDate applicationDeadline,

        @Schema(description = "Se a vaga está ativa", example = "true")
        boolean isActive,

        @Schema(description = "Se a vaga já teve o prazo de inscrição expirado", example = "false")
        boolean isExpired,

        @Schema(description = "Nome da empresa", example = "Magazine Luiza")
        String companyName,

        @Schema(description = "URL da foto de perfil da empresa", example = "https://res.cloudinary.com/demo/image/upload/v123456/company_profile.jpg")
        String companyProfilePic,

        @Schema(description = "Id da empresa", example = "13")
        Long companyUserId
) {}
