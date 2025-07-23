package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
public class InvalidMediaTypeException extends RuntimeException {
    public InvalidMediaTypeException(String message) {
        super(message);
    }
}
