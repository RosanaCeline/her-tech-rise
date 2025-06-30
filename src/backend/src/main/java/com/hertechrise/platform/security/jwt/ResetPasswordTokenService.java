package com.hertechrise.platform.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

@Service
public class ResetPasswordTokenService {

    private final Key secretKey;

    public ResetPasswordTokenService(@Value("${security.jwt.token.secret-key}") String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateResetToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(Date.from(generateExpirationDate()))
                .signWith(secretKey)
                .compact();
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now()
                .plusMinutes(30).
                toInstant(ZoneOffset.of("-03:00"));
        // Depois verificar como fazer para expirar se ja utilizado
    }

    public String validateResetToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith((SecretKey) secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }
}
