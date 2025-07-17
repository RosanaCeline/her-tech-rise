package com.hertechrise.platform.services;

import com.cloudinary.Cloudinary;
import com.hertechrise.platform.exception.CloudinaryUploadException;
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
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "folder", "posts",           // pasta onde vai armazenar no Cloudinary
                            "resource_type", "auto",     // aceita imagem, vídeo, docs, etc
                            "overwrite", true
                    )
            );

            return (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            //add exeption Cloud
            throw new CloudinaryUploadException("Erro ao enviar arquivo para Cloudinary.",e);
        }
    }

    public String uploadProfilePicture(MultipartFile file, Long userId) {
        try{
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
        } catch (Exception e) {
            //add exeption Cloud
            throw new CloudinaryUploadException("Erro ao enviar arquivo para Cloudinary.");
        }

    }

}
