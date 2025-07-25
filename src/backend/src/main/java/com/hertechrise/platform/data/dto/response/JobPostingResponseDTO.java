package com.hertechrise.platform.data.dto.response;

import com.hertechrise.platform.model.JobContractType;
import com.hertechrise.platform.model.JobLevel;
import com.hertechrise.platform.model.JobModel;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(name = "JobPostingResponseDTO", description = "Informações detalhadas de uma vaga")
public record JobPostingResponseDTO (

        @Schema(description = "Id da vaga", example = "1")
        Long id,

        @Schema(description = "Título da vaga", example = "Desenvolvedor Frontend")
        String title,

        @Schema(description = "Descrição da vaga", example = "Como Desenvolvedor(a) Frontend Pleno, você será responsável " +
                "por criar interfaces modernas, acessíveis e performáticas, colaborando com o time de produto e design " +
                "para entregar experiências incríveis aos nossos usuários.")
        String description,

        @Schema(description = "Requisitos para a vaga", example = "Domínio em HTML, CSS, JavaScript e TypeScript e Experiência em React.")
        String requirements,

        @Schema(description = "Localização da vaga", example = "São Paulo - SP")
        String location,

        @Schema(description = "Modelo da vaga", example = "HIBRIDO")
        JobModel jobModel,

        @Schema(description = "Salário mínimo para a vaga (Opcional)", example = "1570.00")
        BigDecimal salaryMin,

        @Schema(description = "Salário máximo para a vaga (Opcional)", example = "3400.00")
        BigDecimal salaryMax,

        @Schema(description = "Tipo de contrato da vaga", example = "CLT")
        JobContractType contractType,

        @Schema(description = "Nível da vaga", example = "JUNIOR")
        JobLevel jobLevel,

        @Schema(description = "Prazo de inscrição para a vaga", example = "2002-05-01")
        LocalDate applicationDeadline,

        @Schema(description = "Se a vaga está ativa", example = "true")
        boolean isActive,

        @Schema(description = "Se a vaga já teve o prazo de inscrição expirado", example = "false")
        boolean isExpired,

        @Schema(description = "Data de criação da vaga", example = "2002-04-01")
        LocalDateTime createdAt,

        @Schema(description = "Se a vaga foi modificada", example = "false")
        boolean isUpdated,

        @Schema(description = "Quando a vaga foi modificada", example = "null")
        LocalDateTime updatedAt,

        @Schema(description = "Nome da empresa", example = "Magazine Luiza")
        String companyName,

        @Schema(description = "URL da foto de perfil da empresa", example = "https://res.cloudinary.com/demo/image/upload/v123456/company_profile.jpg")
        String companyProfilePic,

        @Schema(description = "Id da empresa", example = "13")
        Long companyUserId
) {}