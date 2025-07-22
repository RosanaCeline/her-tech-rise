package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class VerifySelfFollowException extends IllegalArgumentException {

    public VerifySelfFollowException() {
        super("Você não pode seguir a si mesmo.");
    }

    public VerifySelfFollowException(String message) {
        super(message);
    }
}
