package com.hertechrise.platform.data.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

@Schema(name = "RegisterProfessionalRequestDTO", description = "DTO para o cadastro de profissionais na plataforma")
public record RegisterProfessionalRequestDTO(

        @Schema(description = "Nome completo do profissional", example = "Ana Clara Silva")
        @NotBlank(message = "Nome é obrigatório.")
        @Size(min = 1, max = 100, message = "Nome deve ter no mínimo 1 e no máximo 150 caracteres.")
        String name,

        @Schema(description = "CPF do profissional (formato válido)", example = "123.456.789-09")
        @NotBlank(message = "CPF é obrigatório.")
        @CPF(message = "CPF inválido.")
        String cpf,

        @Schema(description = "Data de nascimento no formato dd/MM/yyyy", example = "15/11/2004", type = "string")
        @NotNull(message = "Data de nascimento é obrigatória.")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
        LocalDate birthDate,

        @Schema(description = "Número de telefone", example = "(11) 91234-5678")
        @NotBlank(message = "Telefone é obrigatório.")
        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres.")
        String phoneNumber,

        @Schema(description = "CEP no formato 00000-000", example = "12345-678")
        @NotBlank(message = "CEP é obrigatório.")
        @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP inválido. Exemplo: 00000-000")
        String cep,

        @Schema(description = "Cidade onde o profissional reside", example = "Campinas")
        @NotBlank(message = "Cidade é obrigatória.")
        @Size(max = 100, message = "Cidade deve ter no máximo 100 caracteres.")
        String city,

        @Schema(description = "Rua de residência", example = "Rua das Desenvolvedoras")
        @NotBlank(message = "Rua é obrigatória.")
        @Size(max = 100, message = "Rua deve ter no máximo 100 caracteres.")
        String street,

        @Schema(description = "Bairro onde reside", example = "Jardim das Inovações")
        @NotBlank(message = "Bairro é obrigatório.")
        @Size(max = 100, message = "Bairro deve ter no máximo 100 caracteres.")
        String neighborhood,

        @Schema(description = "Email para login", example = "ana.clara@email.com")
        @NotBlank(message = "Email é obrigatório.")
        @Email(message = "Email inválido.")
        @Size(max = 255, message = "Email deve ter no máximo 255 caracteres.")
        String email,

        @Schema(description = "Senha com no mínimo 6 caracteres", example = "minhaSenhaSegura123")
        @NotBlank(message = "Senha é obrigatória.")
        @Size(min = 6, max = 70, message = "Senha deve ter no mínimo 6 e no máximo 70 caracteres.")
        String password
) {}