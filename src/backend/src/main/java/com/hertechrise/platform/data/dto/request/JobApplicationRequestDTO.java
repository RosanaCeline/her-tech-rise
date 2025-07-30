package com.hertechrise.platform.data.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public record JobApplicationRequestDTO(

        @NotNull(message = "Id da vaga é obrigatório.")
        Long jobPostingId,

        @Size(max = 1000, message = "Link do GitHub deve ter no máximo 1000 caracteres.")
        String githubLink,

        @Size(max = 1000, message = "Link do portfólio deve ter no máximo 1000 caracteres.")
        String portfolioLink,

        @NotNull(message = "Currículo é obrigatório.")
        MultipartFile resumeFile

) {}

