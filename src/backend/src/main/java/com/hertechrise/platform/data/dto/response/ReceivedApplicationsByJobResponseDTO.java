package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

@Schema(name = "ReceivedApplicationsByJobResponseDTO", description = "Resumo de candidaturas recebidas para uma vaga específica")
public record ReceivedApplicationsByJobResponseDTO(

        @Schema(description = "ID da vaga", example = "23")
        Long jobId,

        @Schema(description = "Título da vaga", example = "Desenvolvedor Backend Java")
        String jobTitle,

        @Schema(description = "Prazo de inscrição da vaga", example = "2024-08-15")
        LocalDate applicationDeadline,

        @Schema(description = "Se a vaga está ativa", example = "true")
        boolean isActive,

        @Schema(description = "Se o prazo de inscrição da vaga expirou", example = "false")
        boolean isExpired,

        @Schema(description = "Nome da empresa", example = "Magazine Luiza")
        String companyName,

        @Schema(description = "Foto de perfil da empresa", example = "https://res.cloudinary.com/demo/image/upload/v123456/company_profile.jpg")
        String companyProfilePic,

        @Schema(description = "Quantidade total de candidaturas para a vaga", example = "5")
        int totalApplications,

        @Schema(description = "Lista de candidaturas recebidas")
        List<ReceivedApplicationSummaryResponseDTO> applications

) {}

