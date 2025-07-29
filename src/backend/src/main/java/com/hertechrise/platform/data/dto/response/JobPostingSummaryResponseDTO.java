package com.hertechrise.platform.data.dto.response;

import com.hertechrise.platform.model.JobContractType;
import com.hertechrise.platform.model.JobLevel;
import com.hertechrise.platform.model.JobModel;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(name = "JobPostingSummaryResponseDTO", description = "Resumo das informações de uma vaga")
public record JobPostingSummaryResponseDTO(

        @Schema(description = "Id da vaga", example = "1")
        Long id,

        @Schema(description = "Título da vaga", example = "Desenvolvedor Frontend")
        String title,

        @Schema(description = "Nome da empresa", example = "Magazine Luiza")
        String companyName,

        @Schema(description = "Localização da vaga", example = "São Paulo - SP")
        String location,

        @Schema(description = "Descrição da vaga", example = "Desenvolvedor Júnior Frontend")
        String description,

        @Schema(description = "Requisitos da vaga", example = "HTML, CSS  e JavaScript")
        String requirements,

        @Schema(description = "Tipo de contrato", example = "CLT")
        JobContractType contractType,

        @Schema(description = "Modelo da vaga", example = "HIBRIDO")
        JobModel jobModel,

        @Schema(description = "Prazo de inscrição para a vaga", example = "2002-05-01")
        LocalDate applicationDeadline,

        @Schema(description = "Se a vaga está ativa", example = "true")
        boolean isActive,

        @Schema(description = "Se a vaga já teve o prazo de inscrição expirado", example = "false")
        boolean isExpired,

        @Schema(description = "Se a vaga foi modificada", example = "false")
        boolean isUpdated,

        @Schema(description = "Quando a vaga foi modificada", example = "null")
        LocalDateTime updatedAt,

        @Schema(description = "URL da foto de perfil da empresa", example = "https://res.cloudinary.com/demo/image/upload/v123456/company_profile.jpg")
        String companyProfilePic,

        @Schema(description = "Id da empresa", example = "13")
        Long companyUserId
) {}
