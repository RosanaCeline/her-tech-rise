package com.hertechrise.platform.services;
import com.hertechrise.platform.data.dto.request.MediaRequestDTO;
import com.hertechrise.platform.model.Media;
import com.hertechrise.platform.model.MediaType;
import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.repository.MediaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.util.List;
import com.hertechrise.platform.data.dto.request.MediaRequestDTO;
import com.hertechrise.platform.model.Media;
import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MediaServiceTest {

    //MediaService converte uma list de obj MRDTO em uma list media (post)
    @Autowired
    private MediaService mediaService;


    @DisplayName("Deve construir entidades de midia com sucesso")
    @Test
    void buildMediaEntitiesSuccess() {
        Post post = new Post();
        MediaRequestDTO dto = new MediaRequestDTO(
                MediaType.IMAGEM,
                "image/png",
                "https://res.cloudinary.com/dl63ih00u/image/upload/v1752673929/profile_pics/user_2.jpg"
        );

        List<Media> result = mediaService.buildMediaEntities(post, List.of(dto));

        assertEquals(1, result.size());
        Media media = result.get(0);
        assertEquals(post, media.getPost());
        assertEquals(MediaType.IMAGEM, media.getMediaType());
        assertEquals("image/png", media.getMimeType());
        assertEquals("https://res.cloudinary.com/dl63ih00u/image/upload/v1752673929/profile_pics/user_2.jpg", media.getUrl());
    }

    @DisplayName(" Quando MediaRequestDTO for NULL deve retorna uma vazia")
    @Test
    void shouldReturnEmptyListWhenMediaRequestIsNull() {
       // if (dtos == null) return List.of();
        Post post = new Post();
        List<Media> result = mediaService.buildMediaEntities(post, null);
        assertNotNull(result);
        // return list vazia
        assertTrue(result.isEmpty());
    }

    @DisplayName(" Quando MediaRequestDTO estiver vazia deve retorna uma list vazia ")
    @Test
    void shouldReturnEmptyListWhenMediaRequestIsEmpty() {
        // if (mediaRequestDTO == empty) return List.of();

        Post post = new Post();
        List<Media> result = mediaService.buildMediaEntities(post, List.of());
        assertNotNull(result);

        // return list vazia
        assertTrue(result.isEmpty());
    }

}
