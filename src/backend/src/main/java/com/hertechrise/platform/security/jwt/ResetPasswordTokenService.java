package com.hertechrise.platform.security.jwt;

import com.hertechrise.platform.exception.InvalidResetTokenException;
import com.hertechrise.platform.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Service
public class ResetPasswordTokenService {

    public static final Duration VALIDITY = Duration.ofMinutes(30);
    private static final String PURPOSE = "password-reset";

    private final SecretKey secretKey;
    private final String secret;

    public ResetPasswordTokenService(@Value("${security.jwt.token.secret-key}") String secret) {
        this.secret = secret;
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateResetToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("purpose", PURPOSE)
                .claim("pwd", PasswordFingerprint.of(user.getPassword(), secret))
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(VALIDITY)))
                .signWith(secretKey)
                .compact();
    }

    public record ResetTokenData(String email, String passwordFingerprint) {}

    public ResetTokenData validateResetToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            if (!PURPOSE.equals(claims.get("purpose", String.class))) {
                throw new InvalidResetTokenException();
            }
            return new ResetTokenData(claims.getSubject(), claims.get("pwd", String.class));
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidResetTokenException();
        }
    }

    public boolean matchesCurrentPassword(ResetTokenData data, User user) {
        return PasswordFingerprint.matches(PasswordFingerprint.of(user.getPassword(), secret), data.passwordFingerprint());
    }
}
