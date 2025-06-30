package com.hertechrise.platform.services.event;

import com.hertechrise.platform.model.User;
import org.springframework.context.ApplicationEvent;

public class UserCreatedEvent extends ApplicationEvent {

    private final User user;

    public UserCreatedEvent(Object source, User user) {
        super(source);
        this.user = user;
    }

    public String getEmail() {
        return user.getEmail();
    }

    public String getRole(){
        return user.getRole().getName();
    }
}