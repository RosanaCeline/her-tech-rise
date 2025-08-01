package com.hertechrise.platform.data.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "ProfessionalProfileResponseDTO", description = "DTO para resposta do perfil profissional")
public record ProfessionalProfileResponseDTO(

        @Schema(description = "ID do profissional", example = "123")
        Long id,

        @Schema(description = "Nome completo do profissional", example = "Ana Clara Silva")
        String name,

        @Schema(description = "Identificador único do usuário (handle)", example = "@anaclara")
        String handle,

        @Schema(description = "Link externo para portfólio ou rede social", example = "https://github.com/ana-dev")
        String externalLink,

        @Schema(description = "Email do profissional", example = "ana.clara@email.com")
        String email,

        @Schema(description = "Número de telefone", example = "(11) 91234-5678")
        String phoneNumber,

        @Schema(description = "Cidade de residência", example = "Campinas")
        String city,

        @Schema(description = "Estado (UF) de residência", example = "SP")
        String uf,

        @Schema(description = "Número de seguidores", example = "154")
        Long followersCount,

        @Schema(description = "URL da foto de perfil", example = "https://res.cloudinary.com/demo/image/upload/v123456/profile.jpg")
        String profilePic,

        @Schema(description = "Tecnologias ou stack principal", example = "Java | Spring Boot")
        String technology,

        @Schema(description = "Biografia do profissional", example = "Desenvolvedora backend com 5 anos de experiência em Java e AWS.")
        String biography,

        List<ExperienceResponseDTO> experiences,

        List<UnifiedPostResponseDTO> posts
) {}
