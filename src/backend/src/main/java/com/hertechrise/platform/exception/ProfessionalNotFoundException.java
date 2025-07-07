package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProfessionalNotFoundException extends RuntimeException {
    public ProfessionalNotFoundException() {
      super("Profissional não encontrado");
    }

    public ProfessionalNotFoundException(String message) {
      super(message);
    }
}
