package com.hertechrise.platform;

import com.hertechrise.platform.config.DotenvInitializer;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class Startup {

	public static void main(String[] args) {
		new SpringApplicationBuilder(Startup.class)
				.initializers(new DotenvInitializer())
				.run(args);
	}
}
