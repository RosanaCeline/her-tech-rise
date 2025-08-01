package com.hertechrise.platform.data.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hertechrise.platform.model.ProfessionalGender;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;
import java.util.List;

@Schema(name = "ProfessionalProfileRequestDTO", description = "DTO para o edição dos dados de profissionais na plataforma")
public record ProfessionalProfileRequestDTO(

        @Schema(description = "Nome completo do profissional", example = "Ana Clara Silva")
        @NotBlank(message = "Nome é obrigatório.")
        @Size(min = 1, max = 150, message = "Nome deve ter no mínimo 1 e no máximo 150 caracteres.")
        String name,

        @Schema(description = "CPF do profissional (formato válido)", example = "123.456.789-09")
        @NotBlank(message = "CPF é obrigatório.")
        @CPF(message = "CPF inválido.")
        String cpf,

        @Schema(description = "Identidade de gênero do profissional", example = "OUTRO")
        @NotNull(message = "Identidade de gênero é obrigatória.")
        ProfessionalGender gender,

        @Schema(description = "Consentimento para compartilhar gênero do profissional nas vagas", example = "false")
        @NotNull(message = "Informar se há consentimento para compartilhamento de gênero é obrigátorio.")
        Boolean consentGenderSharing,

        @Schema(description = "Data de nascimento no formato dd/MM/yyyy", example = "15/11/2004", type = "string")
        @NotNull(message = "Data de nascimento é obrigatória.")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
        LocalDate birthDate,

        @Schema(description = "Número de telefone", example = "(11) 91234-5678")
        @NotBlank(message = "Telefone é obrigatório.")
        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres.")
        String phoneNumber,

        @Schema(description = "Email para login", example = "ana.clara@email.com")
        @NotBlank(message = "Email é obrigatório.")
        @Email(message = "Email inválido.")
        @Size(max = 255, message = "Email deve ter no máximo 255 caracteres.")
        String email,

        @Schema(description = "CEP no formato 00000-000", example = "12345-678")
        @NotBlank(message = "CEP é obrigatório.")
        @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP inválido. Exemplo: 00000-000")
        String cep,

        @Schema(description = "Bairro onde reside", example = "Jardim das Inovações")
        @NotBlank(message = "Bairro é obrigatório.")
        @Size(max = 100, message = "Bairro deve ter no máximo 100 caracteres.")
        String neighborhood,

        @Schema(description = "Rua de residência", example = "Rua das Desenvolvedoras")
        @NotBlank(message = "Rua é obrigatória.")
        @Size(max = 100, message = "Rua deve ter no máximo 100 caracteres.")
        String street,

        @Schema(description = "UF de onde reside", example = "SP")
        @NotBlank(message = "UF é obrigatória.")
        String uf,

        @Schema(
                description = "Tecnologias ou stack principal do profissional (máx. 80 caracteres)",
                example = "Java, Spring Boot"
        )
        String technology,

        @Schema(
                description = "Biografia do profissional (máx. 1000 caracteres)",
                example = "Desenvolvedora backend com 5 anos de experiência em Java e AWS."
        )
        String biography,

        @ArraySchema(
                schema = @Schema(implementation = ExperienceRequestDTO.class),
                minItems = 0,
                maxItems = 20
        )
        @Schema(description = "Lista de experiências profissionais a sincronizar (máximo 20).")
        @Size(max = 20, message = "Máximo de 20 experiências permitidas.")
        List<ExperienceRequestDTO> experiences,

        @Schema(
                description = "Link externo para portfólio ou rede social (http/https, máx. 100 caracteres)",
                example = "https://github.com/ana-dev",
                maxLength = 100
        )
        String externalLink
) {}