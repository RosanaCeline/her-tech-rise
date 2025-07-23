package com.hertechrise.platform.services;

import com.cloudinary.Cloudinary;
import com.hertechrise.platform.exception.InvalidMediaTypeException;
import com.hertechrise.platform.exception.MediaFileTooLargeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        String mimeType = file.getContentType();
        long size = file.getSize();

        if (mimeType == null) {
            throw new InvalidMediaTypeException("Tipo de mídia não identificado.");
        }

        if (!mimeType.matches("^(image|video|application)/.+$")) {
            throw new InvalidMediaTypeException("Tipo de arquivo não suportado: " + mimeType);
        }

        if (mimeType.startsWith("image/") && size > 10 * 1024 * 1024) {
            throw new MediaFileTooLargeException("Imagem excede o limite de 10MB.");
        }

        if (mimeType.startsWith("video/") && size > 100 * 1024 * 1024) {
            throw new MediaFileTooLargeException("Vídeo excede o limite de 100MB.");
        }

        if (mimeType.startsWith("application/") && size > 10 * 1024 * 1024) {
            throw new MediaFileTooLargeException("Documento excede o limite de 10MB.");
        }

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "folder", "posts",
                            "resource_type", "auto",
                            "overwrite", true
                    )
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Erro ao fazer upload para Cloudinary", e);
        }
    }


    public String uploadProfilePicture(MultipartFile file, Long userId) {
        String mimeType = file.getContentType();
        long size = file.getSize();

        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new InvalidMediaTypeException("A foto de perfil deve ser uma imagem.");
        }

        if (size > 10 * 1024 * 1024) {
            throw new MediaFileTooLargeException("Imagem excede o limite de 10MB.");
        }

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "folder", "profile_pics",
                            "public_id", "user_" + userId,
                            "overwrite", true,
                            "resource_type", "image"
                    )
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Erro ao fazer upload para Cloudinary", e);
        }
    }


}
