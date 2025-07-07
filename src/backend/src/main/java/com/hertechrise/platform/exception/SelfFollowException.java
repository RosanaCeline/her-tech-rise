package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SelfFollowException extends IllegalArgumentException {

    public SelfFollowException() {
        super("Você não pode seguir a si mesmo.");
    }

    public SelfFollowException(String message) {
        super(message);
    }
}
