package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class FileReadException extends RuntimeException {
    public FileReadException() {
        super("Falha ao ler o arquivo enviado.");
    }

    public FileReadException(String message) {
        super(message);
    }
}
