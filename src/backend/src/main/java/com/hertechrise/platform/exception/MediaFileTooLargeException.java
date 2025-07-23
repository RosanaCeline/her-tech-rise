package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
public class MediaFileTooLargeException extends RuntimeException {
    public MediaFileTooLargeException(String message) {
        super(message);
    }
}
