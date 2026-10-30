package com.hertechrise.platform.security.jwt;

import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.hertechrise.platform.model.User;

@Service
public class TokenService {

    public static final String LOGIN_ISSUER = "login-auth-api";
    private static final Logger logger = LoggerFactory.getLogger(TokenService.class);

    @Value("${security.jwt.token.secret-key}")
    private String secretKey;

    @Value("${security.jwt.token.expire-length}")
    private long expireLengthMs;

    @Value("${security.jwt.token.remember-expire-length}")
    private long rememberExpireLengthMs;

    public String generateLoginToken(User user, boolean rememberMe) {
        long duration = rememberMe ? rememberExpireLengthMs : expireLengthMs;
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);

            Instant now = Instant.now();

            return JWT.create()
                    .withIssuer(LOGIN_ISSUER)
                    .withSubject(user.getEmail())
                    .withClaim("id", user.getId())
                    .withClaim("name", user.getName().split(" ")[0])
                    .withClaim("pwd", PasswordFingerprint.of(user.getPassword(), secretKey))
                    .withIssuedAt(now)
                    .withExpiresAt(now.plusMillis(duration))
                    .sign(algorithm);

        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error while generating token", exception);
        }
    }

    public TokenData validateToken(String token, String expectedIssuer) {
        if (token == null) return null;
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .withIssuer(expectedIssuer)
                    .build()
                    .verify(token);

            String email = decodedJWT.getSubject();
            String name = decodedJWT.getClaim("name").asString();
            Long id = decodedJWT.getClaim("id").asLong();
            String passwordFingerprint = decodedJWT.getClaim("pwd").asString();

            return new TokenData(email, id, name, passwordFingerprint);
        } catch (JWTVerificationException exception) {
            logger.debug("Token inválido: {}", exception.getMessage());
            return null;
        }
    }

    public boolean matchesCurrentPassword(TokenData tokenData, User user) {
        return PasswordFingerprint.matches(
                PasswordFingerprint.of(user.getPassword(), secretKey),
                tokenData.getPasswordFingerprint());
    }
}
