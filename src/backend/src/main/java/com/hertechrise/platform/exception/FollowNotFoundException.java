package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // 404
public class FollowNotFoundException extends RuntimeException {

    public FollowNotFoundException() {
        super("Você não segue este usuário.");
    }

    public FollowNotFoundException(String message) {
        super(message);
    }
}
