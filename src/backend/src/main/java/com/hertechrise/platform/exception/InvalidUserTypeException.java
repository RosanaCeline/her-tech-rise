package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidUserTypeException extends RuntimeException {

    public InvalidUserTypeException() {
        super("Tipo de usuário inválido.");
    }

    public InvalidUserTypeException(String message) {
        super(message);
    }
}
