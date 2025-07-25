package com.hertechrise.platform.data.dto.request;

import com.hertechrise.platform.model.JobContractType;
import com.hertechrise.platform.model.JobLevel;
import com.hertechrise.platform.model.JobModel;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record JobPostingRequestDTO(

        @NotBlank
        @Size(max = 100)
        String title,

        @NotBlank
        @Size(max = 2000)
        String description,

        @NotBlank
        @Size(max = 1000)
        String requirements,

        @NotBlank
        @Size(max = 100)
        String location,

        @NotNull
        JobModel jobModel,

        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal salaryMin,

        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal salaryMax,

        @NotNull
        JobContractType contractType,

        @NotNull
        JobLevel jobLevel,

        @NotNull
        @FutureOrPresent(message = "A data limite deve ser hoje ou uma data futura.")
        LocalDate applicationDeadline
) {}

