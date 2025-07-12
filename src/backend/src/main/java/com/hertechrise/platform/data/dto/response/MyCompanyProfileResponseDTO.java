package com.hertechrise.platform.data.dto.response;

import com.hertechrise.platform.model.CompanyType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(name = "MyCompanyProfileResponseDTO", description = "DTO para resposta do perfil de empresa no pop-up de edição")
public record MyCompanyProfileResponseDTO(

        @Schema(description = "ID da empresa", example = "12")
        Long id,

        @Schema(description = "Nome da empresa", example = "Tech Solutions Ltda")
        String name,

        @Schema(description = "CNPJ da empresa", example = "12.345.678/0001-95")
        String cnpj,

        @Schema(description = "Tipo da empresa", example = "NACIONAL")
        CompanyType companyType,

        @Schema(description = "Número de telefone", example = "(11) 91234-5678")
        String phoneNumber,

        @Schema(description = "Email corporativo para login", example = "contato@techsolutions.com.br")
        String email,

        @Schema(description = "CEP da empresa", example = "12345-678")
        String cep,

        @Schema(description = "Bairro da empresa", example = "Vila Olímpia")
        String neighborhood,

        @Schema(description = "Cidade onde a empresa está localizada", example = "São Paulo")
        String city,

        @Schema(description = "Nome da rua", example = "Rua das Inovações")
        String street,

        @Schema(description = "Descrição resumida da empresa", example = "Empresa focada em soluções inovadoras de tecnologia.")
        String description,

        @Schema(description = "Seção 'Sobre Nós' da empresa", example = "Somos apaixonados por inovação e tecnologia para transformar negócios.")
        String aboutUs,

        @Schema(description = "Link externo para portfólio ou rede social", example = "https://github.com/ana-dev")
        String externalLink
) {}