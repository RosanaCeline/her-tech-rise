package com.hertechrise.platform.mail;

import java.nio.file.Files;
import java.nio.file.Paths;

public class EmailTemplateUtil {

    public static String loadTemplate(String filePath, String content) {
        try {
            String template = new String(Files.readAllBytes(Paths.get(filePath)));
            return template.replace("${content}", content);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao carregar template de email", e);
        }
    }
}
