package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.response.UserPictureResponseDTO;
import com.hertechrise.platform.exception.CloudinaryUploadException;
import com.hertechrise.platform.exception.InvalidFileTypeException;
import com.hertechrise.platform.exception.UserNotFoundException;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.text.Normalizer;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

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

    @Transactional
    public UserPictureResponseDTO updateProfilePicture(MultipartFile file) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidFileTypeException("O arquivo enviado não é uma imagem válida.");
        }

        try {
            String secureUrl = cloudinaryService.uploadProfilePicture(file, loggedUser.getId());

            loggedUser.setProfilePic(secureUrl);
            userRepository.save(loggedUser);

            return new UserPictureResponseDTO(
                    loggedUser.getId(),
                    loggedUser.getName(),
                    loggedUser.getProfilePic()
            );

        } catch (Exception e) {
            throw new CloudinaryUploadException();
        }
    }


    @Transactional
    public void deactivateMyProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        User user = userRepository.findById(loggedUser.getId())
                .orElseThrow(UserNotFoundException::new);

        user.setEnabled(false);
        user.setAccountNonLocked(false);

        userRepository.save(user);
    }
}

