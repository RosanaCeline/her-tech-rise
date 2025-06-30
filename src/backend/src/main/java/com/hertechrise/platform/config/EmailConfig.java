package com.hertechrise.platform.config;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Objects;

@Configuration
@ConfigurationProperties(prefix = "spring.mail")
@Getter
@Setter
@NoArgsConstructor
public class EmailConfig {

    private String host;
    private int port;
    private String username;
    private String password;
    private String from;
    private boolean ssl;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof EmailConfig that)) return false;
        return getPort() == that.getPort() && isSsl() == that.isSsl() && Objects.equals(getHost(), that.getHost()) && Objects.equals(getUsername(), that.getUsername()) && Objects.equals(getPassword(), that.getPassword()) && Objects.equals(getFrom(), that.getFrom());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getHost(), getPort(), getUsername(), getPassword(), getFrom(), isSsl());
    }
}