package com.hertechrise.platform.data.dto.request;

import com.hertechrise.platform.model.CompanyType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.br.CNPJ;

@Schema(name = "CompanyProfileRequestDTO", description = "DTO para edição dos dados de empresas na plataforma")
public record CompanyProfileRequestDTO(

        @Schema(description = "Nome da empresa", example = "TechGirls Solutions")
        @NotBlank(message = "Nome é obrigatório.")
        @Size(min = 1, max = 150, message = "Nome deve ter no mínimo 1 e no máximo 150 caracteres.")
        String name,

        @Schema(description = "CNPJ da empresa (formato válido)", example = "12.345.678/0001-90")
        @NotBlank(message = "CNPJ é obrigatório.")
        @CNPJ(message = "CNPJ inválido.")
        String cnpj,

        @Schema(description = "Tipo da empresa (NACIONAL ou INTERNACIONAL)", example = "NACIONAL")
        @NotNull(message = "Tipo da empresa é obrigatório.")
        CompanyType companyType,

        @Schema(description = "Número de telefone", example = "(11) 98765-4321")
        @NotBlank(message = "Telefone é obrigatório.")
        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres.")
        String phoneNumber,

        @Schema(description = "Email para contato ou login", example = "contato@techgirls.com.br")
        @NotBlank(message = "Email é obrigatório.")
        @Email(message = "Email inválido.")
        @Size(max = 255, message = "Email deve ter no máximo 255 caracteres.")
        String email,

        @Schema(description = "CEP no formato 00000-000", example = "04567-890")
        @NotBlank(message = "CEP é obrigatório.")
        @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP inválido. Exemplo: 00000-000")
        String cep,

        @Schema(description = "Bairro onde a empresa se localiza", example = "Centro Tecnológico")
        @NotBlank(message = "Bairro é obrigatório.")
        @Size(max = 100, message = "Bairro deve ter no máximo 100 caracteres.")
        String neighborhood,

        @Schema(description = "Rua onde a empresa se localiza", example = "Avenida das Startups")
        @NotBlank(message = "Rua é obrigatória.")
        @Size(max = 100, message = "Rua deve ter no máximo 100 caracteres.")
        String street,

        @Schema(
                description = "Descrição sobre a empresa (máx. 400 caracteres)",
                example = "Somos uma empresa de tecnologia focada em soluções inclusivas."
        )
        @Size(max = 400, message = "Descrição deve ter no máximo 400 caracteres.")
        String description,

        @Schema(
                description = "Texto sobre a história, missão e valores da empresa (máx. 1000 caracteres)",
                example = "A TechGirls nasceu com a missão de conectar mulheres à tecnologia através de soluções inovadoras."
        )
        @Size(max = 1000, message = "Sobre nós deve ter no máximo 1000 caracteres.")
        String aboutUs,

        @Schema(
                description = "Link externo do site ou rede social da empresa (máx. 100 caracteres)",
                example = "https://www.techgirls.com.br"
        )
        @Size(max = 100, message = "Link externo deve ter no máximo 100 caracteres")
        String externalLink
) {}
