package com.hertechrise.platform.data.dto.response;

import com.hertechrise.platform.model.CompanyType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "CompanyProfileResponseDTO", description = "DTO para resposta do perfil da empresa")
public record CompanyProfileResponseDTO(

        @Schema(description = "ID da empresa", example = "456")
        Long id,

        @Schema(description = "Nome da empresa", example = "TechRise Solutions")
        String name,

        @Schema(description = "Identificador único da empresa (handle)", example = "@techrise")
        String handle,

        @Schema(description = "Link externo para o site ou rede social da empresa", example = "https://www.techrise.com")
        String externalLink,

        @Schema(description = "Email de contato da empresa", example = "contato@techrise.com")
        String email,

        @Schema(description = "Número de telefone da empresa", example = "(11) 98765-4321")
        String phoneNumber,

        @Schema(description = "Cidade onde a empresa está localizada", example = "São Paulo")
        String city,

        @Schema(description = "Estado (UF) onde a empresa está localizada", example = "SP")
        String uf,

        @Schema(description = "Número de seguidores da empresa", example = "2300")
        Long followersCount,

        @Schema(description = "URL da foto de perfil da empresa", example = "https://res.cloudinary.com/demo/image/upload/v123456/company_profile.jpg")
        String profilePic,

        @Schema(description = "Tipo da empresa", example = "TECHNOLOGY")
        CompanyType companyType,

        @Schema(description = "Descrição resumida da empresa", example = "Empresa focada em soluções inovadoras de tecnologia.")
        String description,

        @Schema(description = "Seção 'Sobre Nós' da empresa", example = "Somos apaixonados por inovação e tecnologia para transformar negócios.")
        String aboutUs,

        @Schema(description = "Lista de postagens da empresa")
        List<PostResponseDTO> posts
) {}