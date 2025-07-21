package com.hertechrise.platform.integrationtests.testcontainers;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.lifecycle.Startables;

import java.util.Map;
import java.util.stream.Stream;

@ContextConfiguration(initializers = AbstractIntegrationTest.Initializer.class)
public abstract class AbstractIntegrationTest {

    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15.3");

    static {
        Startables.deepStart(Stream.of(postgres)).join();
    }

    static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

        @Override
        public void initialize(ConfigurableApplicationContext context) {
            ConfigurableEnvironment environment = context.getEnvironment();
            Map<String, Object> testProperties = Map.of(
                    "spring.datasource.url", postgres.getJdbcUrl(),
                    "spring.datasource.username", postgres.getUsername(),
                    "spring.datasource.password", postgres.getPassword(),
                    "spring.datasource.driver-class-name", "org.postgresql.Driver"
            );
            environment.getPropertySources().addFirst(new MapPropertySource("testcontainers", testProperties));
        }
    }
}
