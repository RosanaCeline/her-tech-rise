package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
public class TooManyRequestsException extends RuntimeException {

    public TooManyRequestsException() {
        super("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
    }

    public TooManyRequestsException(String message) {
        super(message);
    }
}
