package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidResetTokenException extends RuntimeException {

    public InvalidResetTokenException() {
        super("Link de redefinição inválido, expirado ou já utilizado. Solicite um novo.");
    }

    public InvalidResetTokenException(String message) {
        super(message);
    }
}
