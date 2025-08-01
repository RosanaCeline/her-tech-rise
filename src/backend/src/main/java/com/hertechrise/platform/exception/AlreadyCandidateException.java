package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class AlreadyCandidateException extends RuntimeException {
    public AlreadyCandidateException() {
        super("Você já se candidatou a esta vaga.");
    }

    public AlreadyCandidateException(String message) {
        super(message);
    }
}
