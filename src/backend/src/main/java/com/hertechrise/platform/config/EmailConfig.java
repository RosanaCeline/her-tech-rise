package com.hertechrise.platform.config;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "brevo")
@Getter
@Setter
@NoArgsConstructor
public class EmailConfig {
    private String apiKey;
    private String senderEmail;
    private String senderName;
}