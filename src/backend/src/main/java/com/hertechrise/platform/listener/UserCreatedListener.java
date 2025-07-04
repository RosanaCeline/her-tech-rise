package com.hertechrise.platform.listener;

import com.hertechrise.platform.services.EmailService;
import com.hertechrise.platform.services.event.UserCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class UserCreatedListener {

    private final EmailService emailService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUserCreated(UserCreatedEvent event) {
        String email = event.getEmail();
        String role = event.getRole();

        if ("PROFESSIONAL".equals(role)) {
            emailService.sendRegisterProfessionalEmail(email);
        } else if ("COMPANY".equals(role)) {
            emailService.sendRegisterCompanyEmail(email);
        }
    }
}
