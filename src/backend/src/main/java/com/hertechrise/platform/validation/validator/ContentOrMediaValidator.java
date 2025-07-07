package com.hertechrise.platform.validation.validator;

import com.hertechrise.platform.data.dto.request.PostRequestDTO;
import com.hertechrise.platform.validation.annotations.ContentOrMediaRequired;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ContentOrMediaValidator
        implements ConstraintValidator<ContentOrMediaRequired, PostRequestDTO> {

    @Override
    public boolean isValid(PostRequestDTO dto, ConstraintValidatorContext ctx) {
        boolean hasContent = dto.content() != null && !dto.content().isBlank();
        boolean hasMedia   = dto.media() != null && !dto.media().isEmpty();
        return hasContent || hasMedia;
    }
}
