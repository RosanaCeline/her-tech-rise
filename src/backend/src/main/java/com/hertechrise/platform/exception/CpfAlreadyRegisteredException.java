package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class CpfAlreadyRegisteredException extends RuntimeException {
    public CpfAlreadyRegisteredException(){
      super("Cpf já registrado.");
    }

    public CpfAlreadyRegisteredException(String message) {
        super(message);
    }
}
