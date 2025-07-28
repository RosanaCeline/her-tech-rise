package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class CloudinaryUploadException extends RuntimeException {
    public CloudinaryUploadException() {
        super("Erro ao enviar arquivo para Cloudinary.");
    }

    public CloudinaryUploadException(String message) {
        super(message);
    }

    // add
    public CloudinaryUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
