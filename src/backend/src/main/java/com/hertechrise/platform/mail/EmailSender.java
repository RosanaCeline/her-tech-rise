package com.hertechrise.platform.mail;

import com.hertechrise.platform.config.EmailConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Component
public class EmailSender implements Serializable {

    private static final Logger logger = LoggerFactory.getLogger(EmailSender.class);
    private static final RestClient restClient = RestClient.create();

    private String to;
    private String subject;
    private String body;

    public EmailSender to(String to) {
        EmailSender message = new EmailSender();
        message.to = to;
        return message;
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
        if (to == null || subject == null || body == null) {
            throw new IllegalStateException("E-mail incompleto: informe destinatário, assunto e mensagem.");
        }

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

            logger.info("Email enviado para {} com o assunto {}", maskEmail(to), subject);

        } catch (RestClientResponseException e) {
            logger.error("Brevo recusou o email '{}' para {}: HTTP {} {}", subject, maskEmail(to),
                    e.getStatusCode().value(), e.getResponseBodyAsString());
            throw new RuntimeException("Erro ao enviar email", e);
        } catch (RestClientException e) {
            logger.error("Falha ao conectar na Brevo para enviar '{}' para {}", subject, maskEmail(to), e);
            throw new RuntimeException("Erro ao enviar email", e);
        }
    }

    private static String maskEmail(String email) {
        int at = email.indexOf('@');
        if (at <= 2) return "***" + email.substring(Math.max(at, 0));
        return email.substring(0, 2) + "***" + email.substring(at);
    }
}