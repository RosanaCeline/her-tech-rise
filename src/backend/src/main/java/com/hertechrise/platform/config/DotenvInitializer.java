package com.hertechrise.platform.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import java.util.HashMap;
import java.util.Map;

public class DotenvInitializer implements
        ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext context) {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        ConfigurableEnvironment env = context.getEnvironment();
        Map<String, Object> envMap = new HashMap<>();

        dotenv.entries().forEach(entry -> {
            envMap.put(entry.getKey(), entry.getValue());
        });

        env.getPropertySources().addFirst(
                new MapPropertySource("dotenvProperties", envMap)
        );
    }
}