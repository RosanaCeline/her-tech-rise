package com.hertechrise.platform;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class Startup {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();

		dotenv.entries().forEach(entry -> {
			if (System.getenv(entry.getKey()) == null) {
				System.setProperty(entry.getKey(), entry.getValue());
			}
		});

		SpringApplication.run(Startup.class, args);
	}

}
