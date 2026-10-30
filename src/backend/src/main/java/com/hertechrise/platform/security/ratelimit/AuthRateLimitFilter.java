package com.hertechrise.platform.security.ratelimit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;

@Component
public class AuthRateLimitFilter extends OncePerRequestFilter {

    private record Limit(int requests, Duration window) {}

    private static final Map<String, Limit> LIMITS = Map.of(
            "/auth/login", new Limit(20, Duration.ofMinutes(5)),
            "/auth/register/professional", new Limit(10, Duration.ofHours(1)),
            "/auth/register/company", new Limit(10, Duration.ofHours(1)),
            "/auth/resetPassword", new Limit(5, Duration.ofMinutes(15)),
            "/auth/confirmedResetPassword", new Limit(10, Duration.ofMinutes(15)),
            "/auth/cpf", new Limit(30, Duration.ofMinutes(10)),
            "/auth/cnpj", new Limit(30, Duration.ofMinutes(10))
    );

    private final RateLimiter rateLimiter;

    public AuthRateLimitFilter(RateLimiter rateLimiter) {
        this.rateLimiter = rateLimiter;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return "OPTIONS".equalsIgnoreCase(request.getMethod()) || !LIMITS.containsKey(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        Limit limit = LIMITS.get(path);

        if (!rateLimiter.tryAcquire("ip:" + request.getRemoteAddr() + ":" + path, limit.requests(), limit.window())) {
            response.setStatus(429);
            response.setHeader("Retry-After", String.valueOf(limit.window().toSeconds()));
            response.setContentType("application/json");
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.getWriter().write("{\"message\":\"Muitas tentativas. Aguarde alguns minutos e tente novamente.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
