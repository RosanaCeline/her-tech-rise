package com.hertechrise.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // 409
public class AlreadyFollowingException extends IllegalStateException {

  public AlreadyFollowingException() {
    super("Você já segue esse usuário.");
  }

  public AlreadyFollowingException(String message) {
    super(message);
  }
}
