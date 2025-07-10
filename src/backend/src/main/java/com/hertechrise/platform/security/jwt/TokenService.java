package com.hertechrise.platform.security.jwt;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

@Service
public class TokenService {

    @Value("${security.jwt.token.secret-key}")
    private String secretKey;

    public String generateToken(String subject, Long id, String name, String issuer, long expirationInHours) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);

            Instant expirationTime = LocalDateTime.now()
                    .plusHours(expirationInHours)
                    .toInstant(ZoneOffset.of("-03:00"));

            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(subject)
                    .withClaim("id", id)
                    .withClaim("name", name)
                    .withExpiresAt(expirationTime)
                    .sign(algorithm);

        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error while generating token", exception);
        }
    }

    public TokenData validateToken(String token, String expectedIssuer) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .withIssuer(expectedIssuer)
                    .build()
                    .verify(token);

            String email = decodedJWT.getSubject();
            String name = decodedJWT.getClaim("name").asString();
            // Long id = Long.valueOf(decodedJWT.getId());
            Long id = decodedJWT.getClaim("id").asLong();

            return new TokenData(email, id, name);
        } catch (JWTVerificationException exception) {
            System.out.println("Erro ao verificar o token: " + exception.getMessage());
            return null;
        }
    }
}
