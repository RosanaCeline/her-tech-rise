package com.hertechrise.platform.mail;

import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class EmailTemplateUtil {

    public static String loadTemplate(String templateName, String content) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/" + templateName);
            String template = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            return template.replace("${content}", content);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao carregar template de email", e);
        }
    }
}