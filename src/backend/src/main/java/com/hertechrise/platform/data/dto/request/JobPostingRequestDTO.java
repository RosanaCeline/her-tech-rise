package com.hertechrise.platform.data.dto.request;

import com.hertechrise.platform.model.JobContractType;
import com.hertechrise.platform.model.JobLevel;
import com.hertechrise.platform.model.JobModel;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record JobPostingRequestDTO(

        @NotBlank(message = "Título da vaga é obrigatório.")
        @Size(max = 100, message = "Título deve ter no máximo 100 caracteres.")
        String title,

        @NotBlank(message = "Descrição da vaga é obrigatória.")
        @Size(max = 2000, message = "Descrição da vaga deve ter no máximo 2000 caracteres.")
        String description,

        @NotBlank(message = "Requisitos da vaga são obrigatórios.")
        @Size(max = 1000, message = "Requisitos da vaga devem ter no máximo 1000 caracteres.")
        String requirements,

        @NotBlank(message = "Localização da vaga é obrigatória.")
        @Size(max = 100, message = "Localização da vaga deve ter no máximo 100 caracteres.")
        String location,

        @NotNull(message = "Modelo da vaga é obrigatório.")
        JobModel jobModel,

        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal salaryMin,

        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal salaryMax,

        @NotNull(message = "Tipo de contrato da vaga é obrigatório.")
        JobContractType contractType,

        @NotNull(message = "Nível da vaga é obrigatório.")
        JobLevel jobLevel,

        @NotNull(message = "Data limite da vaga é obrigatória.")
        @FutureOrPresent(message = "A data limite deve ser hoje ou uma data futura.")
        LocalDate applicationDeadline
) {}

