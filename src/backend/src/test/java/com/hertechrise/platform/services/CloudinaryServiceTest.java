package com.hertechrise.platform.services;

import com.cloudinary.Cloudinary;
import com.hertechrise.platform.config.DotenvInitializer;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import static org.junit.jupiter.api.Assertions.*;
import java.io.InputStream;
import com.hertechrise.platform.exception.CloudinaryUploadException;

@SpringBootTest
@Transactional
@Rollback
@ContextConfiguration(initializers = DotenvInitializer.class)
class CloudinaryServiceTest {
    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private CloudinaryService cloudinaryService;

    @DisplayName("Upload no Cloudinary com sucesso")
    @Test
    void uploadFileSuccess() throws Exception{

        InputStream inputStream = getClass().getResourceAsStream("/imageTestCloudinary.png");
        MultipartFile multipartFile = new MockMultipartFile(
                "file",
                "imageTestCloudinary.png",
                "image/png",
                inputStream
        );

        String url = cloudinaryService.uploadFile(multipartFile);

        assertNotNull(url);
        assertFalse(url.isEmpty());

        System.out.println("URL de Upload:" + url);
    }

    @DisplayName("CloudinaryUploadException")
    @Test
    void uploadFile_throwsCloudinaryUploadException()throws Exception {
        //vazio
        MultipartFile multipartFile = new MockMultipartFile(
                "file",
                "vazio",
                "image/png",
                new byte[0]
        );


        CloudinaryUploadException exception = assertThrows(CloudinaryUploadException.class, () -> {
            cloudinaryService.uploadFile(multipartFile);
        });

        assertEquals("Erro ao enviar arquivo para Cloudinary.", exception.getMessage());

    }

    @DisplayName("Upload ProfilePicture com userId")
    @Test
    void uploadProfilePictureSuccess() throws Exception {
        InputStream inputStream = getClass().getResourceAsStream("/imageTestCloudinary.png");
        MultipartFile multipartFile = new MockMultipartFile(
                "file",
                "imageTestCloudinary.png",
                "image/png",
                inputStream
        );

        //mandando imagem com id ficticio
        String url = cloudinaryService.uploadProfilePicture(multipartFile, 4L);
        assertNotNull(url);
        assertFalse(url.isEmpty());

        assertTrue(url.contains("profile_pics/user_4"));

    }
}