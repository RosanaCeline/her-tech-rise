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
        MultipartFile resumeFile,

        @NotBlank(message = "Email é obrigatório.")
        @Email(message = "Email informado não é válido.")
        @Size(max = 255, message = "Email deve ter no máximo 255 caracteres.")
        String applicantEmail,

        @NotBlank(message = "Telefone é obrigatório.")
        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres.")
        String applicantPhone

) {}

