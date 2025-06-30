package com.hertechrise.platform.services.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class UserPasswordResetEvent extends ApplicationEvent {

    private final String email;
    private final String token;

    public UserPasswordResetEvent(Object source, String email, String token) {
        super(source);
        this.email = email;
        this.token = token;
    }

}
