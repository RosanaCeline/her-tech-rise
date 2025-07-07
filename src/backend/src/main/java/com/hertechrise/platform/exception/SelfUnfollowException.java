package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SelfUnfollowException extends IllegalArgumentException {

    public SelfUnfollowException() {
        super("Você não pode deixar de seguir a si mesmo.");
    }

    public SelfUnfollowException(String message) {
        super(message);
    }
}
