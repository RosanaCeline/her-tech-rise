package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MaxMediaLimitExceededException extends RuntimeException {
    public MaxMediaLimitExceededException() {
        super("Máximo de 10 mídias por postagem.");
    }

    public MaxMediaLimitExceededException(String message) {
        super(message);
    }
}
