package com.hertechrise.platform.listener;

import com.hertechrise.platform.services.EmailService;
import com.hertechrise.platform.services.event.UserPasswordResetEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class UserPasswordResetListener {

    private final EmailService emailService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUserPasswordReset(UserPasswordResetEvent event) {
        String email = event.getEmail();
        String token = event.getToken();

        emailService.sendResetPasswordEmail(email, token);
    }
}
