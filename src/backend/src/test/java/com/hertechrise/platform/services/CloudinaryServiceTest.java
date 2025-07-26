package com.hertechrise.platform.services;

import com.cloudinary.Cloudinary;
import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.exception.InvalidMediaTypeException;
import com.hertechrise.platform.exception.MediaFileTooLargeException;
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
    @DisplayName("Deve lançar InvalidMediaTypeException para mídia inválido")
    @Test
    void uploadFile_throwsInvalidMediaTypeException() throws Exception {
        MultipartFile file = new MockMultipartFile("file", "video.txt", "text/plain", "invalid".getBytes());

        assertThrows(InvalidMediaTypeException.class, () -> cloudinaryService.uploadFile(file));
    }

    @DisplayName("Deve lança MediaFileTooLargeException para imagem maior que 10MB")
    @Test
    void uploadFile_tooLargeImage() {
        byte[] bigImage = new byte[11 * 1024 * 1024]; // 11MB
        MultipartFile bigFile = new MockMultipartFile(
                "file",
                "grandeimagem.png",
                "image/png",
                bigImage
        );

        assertThrows(MediaFileTooLargeException.class, () -> cloudinaryService.uploadFile(bigFile));
    }

    @DisplayName("Deve lança MediaFileTooLargeException para documento maior que 10MB")
    @Test
    void uploadFile_tooLargeDocument() {
        byte[] bigDoc = new byte[12 * 1024 * 1024];
        MultipartFile bigFile = new MockMultipartFile(
                "file",
                "doc.pdf",
                "application/pdf",
                bigDoc
        );

        assertThrows(MediaFileTooLargeException.class, () -> cloudinaryService.uploadFile(bigFile));
    }

    @DisplayName("Deve lança MediaFileTooLargeException para Vídeo maior que 100MB")
    @Test
    void uploadFile_tooLargeVideo() {
        byte[] bigVideo = new byte[101 * 1024 * 1024]; // 101MB
        MultipartFile bigFile = new MockMultipartFile(
                "file",
                "video.mp4",
                "video/mp4",
                bigVideo
        );

        assertThrows(MediaFileTooLargeException.class, () -> cloudinaryService.uploadFile(bigFile));
    }

    @DisplayName("Deve lançar InvalidMediaTypeException para foto de perfil inválida")
    @Test
    void uploadProfilePicture_invalidType() {
        MultipartFile file = new MockMultipartFile(
                "file",
                "notimage.pdf",
                "application/pdf",
                "teste".getBytes()
        );

        assertThrows(InvalidMediaTypeException.class, () ->
                cloudinaryService.uploadProfilePicture(file, 5L)
        );
    }
    @DisplayName("Deve lança InvalidMediaTypeException para arquivo com mimeType nulo")
    @Test
    void uploadFile_nullMimeType() {
        MultipartFile file = new MockMultipartFile(
                "file",
                "null",
                null,  //
                "null".getBytes()
        );

        InvalidMediaTypeException exception = assertThrows(InvalidMediaTypeException.class, () ->
                cloudinaryService.uploadFile(file)
        );

        assertTrue(exception.getMessage().contains("Tipo de mídia não identificado"));
    }



}