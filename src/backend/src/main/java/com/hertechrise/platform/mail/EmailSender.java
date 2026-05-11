package com.hertechrise.platform.mail;

import com.hertechrise.platform.config.EmailConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Component
public class EmailSender implements Serializable {

    Logger logger = LoggerFactory.getLogger(EmailSender.class);

    private final RestClient restClient = RestClient.create();

    private String to;
    private String subject;
    private String body;

    public EmailSender to(String to) {
        this.to = to;
        return this;
    }

    public EmailSender withSubject(String subject) {
        this.subject = subject;
        return this;
    }

    public EmailSender withMessage(String body) {
        this.body = body;
        return this;
    }

    // mantido para não quebrar chamadas existentes
    public EmailSender attach(String fileDir) {
        logger.warn("Attachments não suportados na integração Brevo via API");
        return this;
    }

    public void send(EmailConfig config) {
        Map<String, Object> payload = Map.of(
                "sender", Map.of(
                        "email", config.getSenderEmail(),
                        "name", config.getSenderName()
                ),
                "to", List.of(Map.of("email", to)),
                "subject", subject,
                "htmlContent", body
        );

        try {
            restClient.post()
                    .uri("https://api.brevo.com/v3/smtp/email")
                    .header("api-key", config.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            logger.info("Email enviado para {} com o assunto {}", to, subject);
            reset();

        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Erro ao enviar email: " + e.getResponseBodyAsString(), e);
        }
    }

    private void reset() {
        this.to = null;
        this.subject = null;
        this.body = null;
    }
}