package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidFileTypeException extends RuntimeException {
    public InvalidFileTypeException() {
        super("Tipo do arquivo inválido para essa operação.");
    }

    public InvalidFileTypeException(String message) {
        super(message);
    }
}
