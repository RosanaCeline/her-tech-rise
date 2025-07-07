package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends UsernameNotFoundException {

    public UserNotFoundException () {
        super("Usuário autenticado não encontrado.");
    }

    public UserNotFoundException(String message) {
        super(message);
    }
}

