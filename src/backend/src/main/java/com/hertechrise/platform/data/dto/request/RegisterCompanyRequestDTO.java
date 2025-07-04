package com.hertechrise.platform.data.dto.request;

import com.hertechrise.platform.model.CompanyType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.br.CNPJ;

@Schema(name = "RegisterCompanyRequestDTO", description = "DTO para o cadastro de empresas na plataforma")
public record RegisterCompanyRequestDTO(

        @Schema(description = "Nome da empresa", example = "Tech Solutions Ltda")
        @NotBlank(message = "Nome é obrigatório.")
        @Size(min = 1, max = 150, message = "Nome deve ter no mínimo 1 e no máximo 150 caracteres.")
        String name,

        @Schema(description = "CNPJ válido da empresa", example = "12.345.678/0001-95")
        @NotBlank(message = "CNPJ é obrigatório.")
        @CNPJ(message = "CNPJ inválido.")
        String cnpj,

        @Schema(description = "Tipo da empresa", example = "NACIONAL")
        @NotNull(message = "O tipo da empresa é obrigatório")
        CompanyType companyType,

        @Schema(description = "Número de telefone", example = "(11) 91234-5678")
        @NotBlank(message = "Telefone é obrigatório.")
        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres.")
        String phoneNumber,

        @Schema(description = "CEP da empresa no formato 00000-000", example = "12345-678")
        @NotBlank(message = "CEP é obrigatório.")
        @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP inválido. Exemplo: 00000-000")
        String cep,

        @Schema(description = "Cidade onde a empresa está localizada", example = "São Paulo")
        @NotBlank(message = "Cidade é obrigatória.")
        @Size(max = 100, message = "Cidade deve ter no máximo 100 caracteres.")
        String city,

        @Schema(description = "Nome da rua", example = "Rua das Inovações")
        @NotBlank(message = "Rua é obrigatória.")
        @Size(max = 100, message = "Rua deve ter no máximo 100 caracteres.")
        String street,

        @Schema(description = "Bairro da empresa", example = "Vila Olímpia")
        @NotBlank(message = "Bairro é obrigatório.")
        @Size(max = 100, message = "Bairro deve ter no máximo 100 caracteres.")
        String neighborhood,

        @Schema(description = "Email corporativo para login", example = "contato@techsolutions.com.br")
        @NotBlank(message = "Email é obrigatório.")
        @Email(message = "Email inválido.")
        @Size(max = 255, message = "Email deve ter no máximo 255 caracteres.")
        String email,

        @Schema(description = "Senha de acesso com mínimo de 6 caracteres", example = "senhaForte123")
        @NotBlank(message = "Senha é obrigatória.")
        @Size(min = 6, max = 70, message = "Senha deve ter no mínimo 6 e no máximo 70 caracteres.")
        String password
) {}
