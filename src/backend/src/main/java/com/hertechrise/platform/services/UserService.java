package com.hertechrise.platform.services;

import com.hertechrise.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public String generateUniqueUserHandle(String fullName) {
        // Normaliza (remove acentos), põe tudo minúsculo e remove caracteres inválidos
        String base = Normalizer.normalize(fullName, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .replaceAll("[^a-zA-Z0-9]", "")
                .toLowerCase();

        // Remove espaços e mantém os primeiros 14 caracteres (porque @ ocupa 1)
        if (base.length() > 14) {
            base = base.substring(0, 14);
        }

        String username = "@" + base;
        int suffix = 1;

        // Verifica se já existe e adiciona número incremental
        while (userRepository.existsByHandle(username)) {
            String suffixStr = String.valueOf(suffix);
            int maxLength = 15 - 1 - suffixStr.length(); // 15 total, -1 do @, -suporte ao número
            String truncated = base.length() > maxLength ? base.substring(0, maxLength) : base;
            username = "@" + truncated + suffixStr;
            suffix++;
        }

        return username;
    }
}
