package com.hertechrise.platform.data.dto.response;

import com.hertechrise.platform.model.ProfessionalGender;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(name = "CandidateApplicationDetailsResponseDTO", description = "Informações detalhadas de uma candidatura do ponto de vista do candidato")
public record CandidateApplicationDetailsResponseDTO(

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

        @Schema(description = "Identidade de gênero do candidato", example = "OUTRO")
        ProfessionalGender gender,

        @Schema(description = "URL do currículo enviado", example = "https://res.cloudinary.com/seuapp/curriculo_joao.pdf")
        String resumeUrl,

        @Schema(description = "Link do GitHub do candidato", example = "https://github.com/joaosilva")
        String githubLink,

        @Schema(description = "Link do portfólio do candidato", example = "https://joaosilva.dev")
        String portfolioLink,

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
