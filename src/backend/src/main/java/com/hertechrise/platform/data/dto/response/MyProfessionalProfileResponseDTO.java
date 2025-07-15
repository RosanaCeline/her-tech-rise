package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

@Schema(name = "MyProfessionalProfileResponseDTO", description = "DTO para resposta do perfil profissional no pop-up de edição")
public record MyProfessionalProfileResponseDTO(

        @Schema(description = "ID do profissional", example = "123")
        Long id,

        @Schema(description = "Nome completo do profissional", example = "Ana Clara Silva")
        String name,

        @Schema(description = "CPF do profissional", example = "123.456.789-09")
        String cpf,

        @Schema(description = "Data de nascimento do profissional", example = "01/05/2002")
        LocalDate birthDate,

        @Schema(description = "Número de telefone", example = "(11) 91234-5678")
        String phoneNumber,

        @Schema(description = "Email do profissional", example = "ana.clara@email.com")
        String email,

        @Schema(description = "CEP do profissional", example = "62320-000")
        String cep,

        @Schema(description = "Bairro onde reside", example = "Jardim das Inovações")
        String neighborhood,

        @Schema(description = "Cidade de residência", example = "Campinas")
        String city,

        @Schema(description = "Rua de residência", example = "Rua das Desenvolvedoras")
        String street,

        @Schema(description = "Estado (UF) de residência", example = "SP")
        String uf,

        @Schema(description = "Tecnologias ou stack principal", example = "Java | Spring Boot")
        String technology,

        @Schema(description = "Biografia do profissional", example = "Desenvolvedora backend com 5 anos de experiência em Java e AWS.")
        String biography,

        List<ExperienceResponseDTO> experiences,

        @Schema(description = "Link externo para portfólio ou rede social", example = "https://github.com/ana-dev")
        String externalLink
) {}
