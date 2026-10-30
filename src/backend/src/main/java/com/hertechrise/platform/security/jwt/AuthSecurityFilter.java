package com.hertechrise.platform.security.jwt;

import com.hertechrise.platform.model.User;
import com.hertechrise.platform.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AuthSecurityFilter extends OncePerRequestFilter {

    @Autowired
    TokenService tokenService;

    @Autowired
    UserRepository userRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return !path.startsWith("/api/");  // Só roda para URLs que começam com /api/
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var token = this.recoverToken(request);
        var login = tokenService.validateToken(token, TokenService.LOGIN_ISSUER);

        if (login != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            userRepository.findByEmail(login.getEmail())
                    .filter(User::isEnabled)
                    .filter(user -> tokenService.matchesCurrentPassword(login, user))
                    .ifPresent(user -> {
                        List<GrantedAuthority> authorities = user.getRole().getPermissions().stream()
                                .map(permission -> new SimpleGrantedAuthority(permission.getDescription()))
                                .collect(Collectors.toList());

                        var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    });
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request){
        var authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")) return null;

        return authHeader.substring(7);
    }
}
