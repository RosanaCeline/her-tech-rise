package com.hertechrise.platform.validation.annotations;

import com.hertechrise.platform.validation.validator.ContentOrMediaValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ContentOrMediaValidator.class)
public @interface ContentOrMediaRequired {
    String message() default "Informe o conteúdo ou adicione mídia.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
