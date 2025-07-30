package com.hertechrise.platform.services;

import com.cloudinary.Cloudinary;
import com.hertechrise.platform.exception.CloudinaryUploadException;
import com.hertechrise.platform.exception.InvalidMediaTypeException;
import com.hertechrise.platform.exception.MediaFileTooLargeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
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
                            "overwrite", false
                    )
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Erro ao fazer upload para Cloudinary", e);
        } catch (RuntimeException e) {
            if ("Empty file".equals(e.getMessage())) {
                throw new CloudinaryUploadException("Erro ao enviar arquivo para Cloudinary.", e);
            }
            throw e;
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
                            "overwrite", false,
                            "resource_type", "image"
                    )
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Erro ao fazer upload para Cloudinary", e);
        }
    }

    public String uploadResumeFile(MultipartFile file, String professionalName) {
        String mimeType = file.getContentType();
        long size = file.getSize();

        if (mimeType == null) {
            throw new InvalidMediaTypeException("Tipo de mídia não identificado.");
        }

        if (!List.of(
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ).contains(mimeType)) {
            throw new InvalidMediaTypeException("Apenas arquivos PDF, DOC ou DOCX são permitidos.");
        }

        if (size > 10 * 1024 * 1024) {
            throw new MediaFileTooLargeException("Documento excede o limite de 10MB.");
        }

        try {
            String sanitized = professionalName
                    .toLowerCase()
                    .replaceAll("[^a-z0-9]", "_")
                    .replaceAll("_+", "_")
                    .replaceAll("^_|_$", "");

            String publicId = "curriculo_" + sanitized + "_" + System.currentTimeMillis();

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "folder", "posts",
                            "resource_type", "auto",
                            "overwrite", false,
                            "public_id", publicId
                    )
            );

            String uploadedUrl = (String) uploadResult.get("secure_url");

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !originalFilename.contains(".")) {
                throw new InvalidMediaTypeException("Nome de arquivo inválido.");
            }
            String extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1);

            return uploadedUrl + "?fl_attachment=" + publicId + "." + extension;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao fazer upload para Cloudinary", e);
        } catch (RuntimeException e) {
            if ("Empty file".equals(e.getMessage())) {
                throw new CloudinaryUploadException("Erro ao enviar arquivo para Cloudinary.", e);
            }
            throw e;
        }
    }

}
