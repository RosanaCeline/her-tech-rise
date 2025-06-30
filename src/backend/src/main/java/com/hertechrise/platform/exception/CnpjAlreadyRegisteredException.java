package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class CnpjAlreadyRegisteredException extends RuntimeException {

    public CnpjAlreadyRegisteredException(){
        super("Cnpj já registrado.");
    }

    public CnpjAlreadyRegisteredException(String message) {
        super(message);
    }
}
