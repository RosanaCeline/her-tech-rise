package com.hertechrise.platform.integrationtests.swagger;

import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static io.restassured.RestAssured.given;
import static junit.framework.TestCase.assertTrue;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SwaggerIntegrationTest extends AbstractIntegrationTest {

	@LocalServerPort
	private int port;   // Spring injeta a porta real aqui

	// dada uma url, em uma porta aleatoria, quando eu executar uma operacao do tipo get
	// entao eu espero a resposta status code 200 e vou extrair o conteudo do body como string
	@Test
	void shouldDisplaySwaggerUIPage() {
		var content = given()
				.basePath("/swagger-ui/index.html")
				.port(port)
				.when()
				.get()
				.then()
				.statusCode(200)
				.extract()
				.body()
				.asString();

		assertTrue(content.contains("Swagger UI"));
	}

}
