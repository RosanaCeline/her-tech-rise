package com.hertechrise.platform.services;

import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.data.dto.request.MediaEditRequestDTO;
import com.hertechrise.platform.data.dto.request.PostEditRequestDTO;
import com.hertechrise.platform.data.dto.request.PostFilterRequestDTO;
import com.hertechrise.platform.data.dto.request.PostRequestDTO;
import com.hertechrise.platform.data.dto.response.PostResponseDTO;
import com.hertechrise.platform.exception.InvalidFileTypeException;
import com.hertechrise.platform.exception.InvalidUserTypeException;
import com.hertechrise.platform.exception.MaxMediaLimitExceededException;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.MediaRepository;
import com.hertechrise.platform.repository.PostRepository;
import com.hertechrise.platform.repository.RoleRepository;
import com.hertechrise.platform.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback
@ContextConfiguration(initializers = {DotenvInitializer.class})
class PostServiceTest extends AbstractIntegrationTest {
    @Autowired
    private PostService postService;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private MediaRepository mediaRepository;

    private User createTestUser(String name, String email, String handle) {
        User user = new User();
        user.setName(name);
        user.setEnabled(true);
        user.setUf("CE");
        user.setCep("62320000");
        user.setCity("Tiangua");
        user.setEmail(email);
        user.setNeighborhood("teste");
        user.setStreet("teste");
        user.setHandle(handle);
        user.setPhoneNumber("88900000000");
        user.setPassword("senhasegura123");
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);
        return userRepository.save(user);
    }

    @DisplayName("Cria publicação com sucesso")
    @Test
    void createPost() throws IOException {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream imageInput = getClass().getResourceAsStream("/imageTestPosts.jpg");
        MultipartFile image = new MockMultipartFile(
                "file",
                "imageTestPosts.jpg",
                "image/jpg",
                imageInput
        );
        InputStream videoInput = getClass().getResourceAsStream("/videoTestPosts.mp4");
        MultipartFile video = new MockMultipartFile(
                "file",
                "videoTestPosts.mp4",
                "video/mp4",
                videoInput
        );
        InputStream docsInput = getClass().getResourceAsStream("/docsTestPosts.pdf");
        MultipartFile docs = new MockMultipartFile(
                "file",
                "docsTestPosts.pdf",
                "application/pdf",
                docsInput
        );
        PostRequestDTO request = postService.processPostData("Olá mundo!", null,
                PostVisibility.PUBLICO, List.of(image, video, docs));
        PostResponseDTO response = postService.create(request);

        assertNotNull(response);
        assertEquals("Olá mundo!", response.content());
        assertEquals(3, response.media().size());
        assertEquals(MediaType.IMAGE, response.media().getFirst().mediaType());
        assertEquals(MediaType.VIDEO, response.media().get(1).mediaType());
        assertEquals(MediaType.DOCUMENT, response.media().get(2).mediaType());
    }

    @DisplayName("Anexa arquivo com MIME não suportado")
    @Test
    void createPostAndAttachFileWithUnsupportedMIMEType() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        MultipartFile file = new MockMultipartFile(
                "file",
                "text.txt",
                "text/plain",
                "Olá mundo".getBytes()
        );

        InvalidFileTypeException exception = assertThrows(InvalidFileTypeException.class, () -> {
            PostRequestDTO request = postService.processPostData("Olá mundo!", null,
                    PostVisibility.PUBLICO, List.of(file));
        });
        assertEquals("Tipo não suportado: text/plain", exception.getMessage());
    }

    @DisplayName("Anexa arquivo sem MIME")
    @Test
    void createPostAndAttachFileWithoutMIMEType() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        MultipartFile file = new MockMultipartFile(
                "file",
                "text.txt",
                null,
                "Olá mundo".getBytes()
        );

        InvalidFileTypeException exception = assertThrows(InvalidFileTypeException.class, () -> {
            PostRequestDTO request = postService.processPostData("Olá mundo!", null,
                    PostVisibility.PUBLICO, List.of(file));
        });
        assertEquals("MIME nulo", exception.getMessage());
    }

    @DisplayName("Cria publicação sem midias com sucesso")
    @Test
    void createPostWithoutMedia(){
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        PostRequestDTO request = postService.processPostData("Olá mundo!", null,
                PostVisibility.PUBLICO, List.of());
        PostResponseDTO response = postService.create(request);

        assertNotNull(response);
        assertEquals("Olá mundo!", response.content());
        assertEquals(0, response.media().size());
    }

    @DisplayName("Cria publicação anexando mais de 10 mídias")
    @Test
    void createPostWithMoreThan10Medias() throws Exception{
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream imageInput = getClass().getResourceAsStream("/imageTestPosts.jpg");
        MultipartFile image = new MockMultipartFile(
                "file", "imageTestPosts.jpg", "image/jpg", imageInput);

        ArrayList<MultipartFile> medias = new ArrayList<>();
        for(int i = 0; i < 11; i++){medias.add(image);}

        PostRequestDTO request = postService.processPostData("Olá mundo!", null,
                PostVisibility.PUBLICO, medias);

        MaxMediaLimitExceededException exception = assertThrows(MaxMediaLimitExceededException.class, () -> {
            postService.create(request);
        });
        assertEquals("Máximo de 10 mídias por postagem.",  exception.getMessage());
    }

    @DisplayName("Deleta publicação com sucesso")
    @Test
    void deletePost(){
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        postService.delete(post.getId());

        assertEquals(true, post.isDeleted());
    }

    @DisplayName("Deleta publicação com ID não encontrado")
    @Test
    void deletePostNotFound(){
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            postService.delete(1L);
        });
        assertEquals("Postagem não encontrada.", exception.getMessage());
    }

    @DisplayName("Deleta publicação da qual não é o autor")
    @Test
    void userDeletePostWhenIsNotAuthor(){
        User user_1 = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        User user_2 = createTestUser("Teste", "teste@email.com", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user_2, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(user_1);
        post.setContent("Olá mundo!");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> {
            postService.delete(post.getId());
        });
        assertEquals("Você não tem permissão para excluir esta postagem.", exception.getMessage());
    }

    @DisplayName("Altera visibilidade de publicação com sucesso")
    @Test
    void updateVisibility(){
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        post.setVisibility(PostVisibility.PUBLICO);
        postRepository.save(post);

        postService.updateVisibility(post.getId(), PostVisibility.PRIVADO);

        assertEquals(PostVisibility.PRIVADO, post.getVisibility());
    }

    @DisplayName("Altera visibilidade de  publicação com ID não encontrado")
    @Test
    void updateVisibilityPostNotFound(){
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            postService.updateVisibility(1L,  PostVisibility.PRIVADO);
        });
        assertEquals("Postagem não encontrada.", exception.getMessage());
    }

    @DisplayName("Altera visibilidade de publicação da qual não é o autor")
    @Test
    void userUpdateVisibilityPostWhenIsNotAuthor(){
        User user_1 = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        User user_2 = createTestUser("Teste", "teste@email.com", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user_2, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(user_1);
        post.setContent("Olá mundo!");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> {
            postService.updateVisibility(post.getId(), PostVisibility.PRIVADO);
        });
        assertEquals("Você não tem permissão para alterar a visibilidade desta postagem.", exception.getMessage());
    }

    @DisplayName("Edita publicação")
    @Test
    void editPost() throws Exception{
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream imageInput = getClass().getResourceAsStream("/imageTestPosts.jpg");
        MultipartFile image = new MockMultipartFile(
                "file", "imageTestPosts.jpg", "image/jpg", imageInput);

        MediaEditRequestDTO mediaDTO = new MediaEditRequestDTO(
                null, image, MediaType.IMAGE, "image/jpg", null);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        PostEditRequestDTO request = new PostEditRequestDTO("Essa é minha postagem", PostVisibility.PRIVADO,
                List.of(mediaDTO));
        PostResponseDTO response = postService.editPost(post.getId(), request);

        assertNotNull(response);
        assertEquals("Essa é minha postagem", response.content());
        assertEquals(PostVisibility.PRIVADO, response.visibility());
        assertEquals(1, response.media().size());
        assertTrue(response.edited());
    }

    @DisplayName("Edita publicação com ID não encontrado")
    @Test
    void editPostNotFound(){
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
        PostEditRequestDTO request = new PostEditRequestDTO(
                "Essa é minha postagem", PostVisibility.PRIVADO, List.of());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            postService.editPost(1L,  request);
        });
        assertEquals("Postagem não encontrada.", exception.getMessage());
    }

    @DisplayName("Edita publicação da qual não é o autor")
    @Test
    void userEditPostWhenIsNotAuthor(){
        User user_1 = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        User user_2 = createTestUser("Teste", "teste@email.com", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user_2, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(user_1);
        post.setContent("Olá mundo!");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        PostEditRequestDTO request = new PostEditRequestDTO(
                "Essa é minha postagem", PostVisibility.PRIVADO, List.of());

        AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> {
            postService.editPost(post.getId(), request);
        });
        assertEquals("Você não tem permissão para editar esta postagem.", exception.getMessage());
    }

    @DisplayName("Publicação só pode ser editada até 7 dias após sua criação")
    @Test
    void postOnlyCanByEdit7DaysAfter(){
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post_1 = new Post();
        post_1.setAuthor(loggedUser);
        post_1.setContent("Olá mundo");
        post_1.setCreatedAt(LocalDateTime.now().minusDays(6));
        postRepository.save(post_1);

        Post post_2 = new Post();
        post_2.setAuthor(loggedUser);
        post_2.setContent("Olá mundo");
        post_2.setCreatedAt(LocalDateTime.now().minusDays(7));
        postRepository.save(post_2);

        System.out.println(post_2.getCreatedAt());

        PostEditRequestDTO request = new PostEditRequestDTO("Essa é minha postagem", PostVisibility.PRIVADO,
                List.of());

        assertDoesNotThrow(() -> {
            postService.editPost(post_1.getId(), request);
        });
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            postService.editPost(post_2.getId(), request);
        });
        assertEquals("Você só pode editar postagens feitas nos últimos 7 dias.", exception.getMessage());
    }

    @DisplayName("Edita publicação anexando mais de 10 mídias")
    @Test
    void editPostWithMoreThan10Medias() throws Exception{
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream imageInput = getClass().getResourceAsStream("/imageTestPosts.jpg");
        MultipartFile image = new MockMultipartFile(
                "file", "imageTestPosts.jpg", "image/jpg", imageInput);

        MediaEditRequestDTO mediaDTO = new MediaEditRequestDTO(
                null, image, MediaType.IMAGE, "application/pdf", null);
        ArrayList<MediaEditRequestDTO> medias = new ArrayList<>();
        for(int i = 0; i < 11; i++){medias.add(mediaDTO);}

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        PostEditRequestDTO request = new PostEditRequestDTO("Essa é minha postagem", PostVisibility.PRIVADO,
                medias);

        MaxMediaLimitExceededException exception = assertThrows(MaxMediaLimitExceededException.class, () -> {
            postService.editPost(post.getId(), request);
        });
        assertEquals("Máximo de 10 mídias por postagem.",  exception.getMessage());
    }

    @DisplayName("Edita publicação e anexa arquivo com MIME type inválido")
    @Test
    void editPostAndAttachFileWithInvalidMIMEType() throws Exception{
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        MultipartFile image = new MockMultipartFile(
                "file", "imageTestPosts.jpg", "text/plain", "Olá mundo".getBytes());

        MediaEditRequestDTO mediaDTO = new MediaEditRequestDTO(
                null, image, MediaType.IMAGE, "text/plain", null);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        PostEditRequestDTO request = new PostEditRequestDTO("Essa é minha postagem", PostVisibility.PRIVADO,
                List.of(mediaDTO));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            postService.editPost(post.getId(), request);
        });
        assertEquals("MIME inválido para arquivo: text/plain", exception.getMessage());
    }

    @DisplayName("Edita publicação e remove midias que não foram enviadas novamente")
    @Test
    void editPostAndRemoveOldMedias() throws Exception{
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        Media media = new Media();
        media.setPost(post);
        media.setMediaType(MediaType.IMAGE);
        media.setMimeType("image/jpg");
        media.setUrl("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        post.getMedia().add(media);
        mediaRepository.save(media);

        InputStream imageInput = getClass().getResourceAsStream("/imageTestPosts.jpg");
        MultipartFile image = new MockMultipartFile(
                "file", "imageTestPosts.jpg", "image/jpg", imageInput);

        MediaEditRequestDTO mediaDTO = new MediaEditRequestDTO(
                null, image, MediaType.IMAGE, "image/jpg", null);

        PostEditRequestDTO request = new PostEditRequestDTO("Essa é minha postagem", PostVisibility.PRIVADO,
                List.of(mediaDTO));
        PostResponseDTO response = postService.editPost(post.getId(), request);

        assertNotNull(response);
        assertEquals(1, response.media().size());
    }

    @DisplayName("Listar posts do usuário logado")
    @Test
    void getMyPosts(){
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post_1 = new Post();
        post_1.setAuthor(loggedUser);
        post_1.setContent("Postando a uma hora e privado");
        post_1.setVisibility(PostVisibility.PRIVADO);
        post_1.setCreatedAt(LocalDateTime.now().minusHours(1));
        postRepository.save(post_1);

        Media media = new Media();
        media.setPost(post_1);
        media.setMediaType(MediaType.IMAGE);
        media.setMimeType("image/jpg");
        media.setUrl("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        post_1.getMedia().add(media);
        mediaRepository.save(media);

        Post post_2 = new Post();
        post_2.setAuthor(loggedUser);
        post_2.setContent("Postando a 10 minutos e editado");
        post_2.setCreatedAt(LocalDateTime.now().minusMinutes(10));
        post_2.setEdited(true);
        post_2.setMedia(null);
        postRepository.save(post_2);

        Post post_3 = new Post();
        post_3.setAuthor(loggedUser);
        post_3.setContent("Postagem apagada");
        post_3.setCreatedAt(LocalDateTime.now());
        post_3.setDeleted(true);
        post_3.setMedia(null);
        postRepository.save(post_3);

        Post post_4 = new Post();
        post_4.setAuthor(loggedUser);
        post_4.setContent("Postando a 7 dias");
        post_4.setCreatedAt(LocalDateTime.now().minusDays(7));
        post_4.setMedia(null);
        postRepository.save(post_4);

        User user = createTestUser("Teste", "teste@email.com", "@teste");
        Post post_5 = new Post();
        post_5.setAuthor(user);
        post_5.setContent("Postagem de outro usuário");
        post_5.setCreatedAt(LocalDateTime.now());
        postRepository.save(post_5);

        Page<PostResponseDTO> response = postService.getMyPosts(new PostFilterRequestDTO(
                null, null, null, null));

        assertNotNull(response);
        assertEquals(3, response.getTotalElements());
        assertEquals(1, response.getTotalPages());
        assertEquals(10, response.getSize());
        assertEquals("Postando a 10 minutos e editado", response.getContent().getFirst().content());
        assertTrue(response.getContent().getFirst().edited());
        assertEquals("Postando a uma hora e privado", response.getContent().get(1).content());
        assertEquals(1, response.getContent().get(1).media().size());
        assertEquals("Postando a 7 dias", response.getContent().get(2).content());
        assertFalse(response.getContent().get(2).canEdit());
        assertFalse(response.getContent().stream()
                        .anyMatch(post -> post.content().equals("Postagem apagada")));
        assertFalse(response.getContent().stream()
                .anyMatch(post -> post.content().equals("Postagem de outro usuario")));
    }

    @DisplayName("Listar posts de outro usuário")
    @Test
    void getUserPosts(){
        User user = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");

        Post post_1 = new Post();
        post_1.setAuthor(user);
        post_1.setContent("Postando a uma hora e privado");
        post_1.setVisibility(PostVisibility.PRIVADO);
        post_1.setCreatedAt(LocalDateTime.now().minusHours(1));
        postRepository.save(post_1);

        Post post_2 = new Post();
        post_2.setAuthor(user);
        post_2.setContent("Postando a 10 minutos e editado");
        post_2.setCreatedAt(LocalDateTime.now().minusMinutes(10));
        post_2.setEdited(true);
        postRepository.save(post_2);

        Media media = new Media();
        media.setPost(post_2);
        media.setMediaType(MediaType.IMAGE);
        media.setMimeType("image/jpg");
        media.setUrl("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        post_2.getMedia().add(media);
        mediaRepository.save(media);

        Post post_3 = new Post();
        post_3.setAuthor(user);
        post_3.setContent("Postagem apagada");
        post_3.setCreatedAt(LocalDateTime.now());
        post_3.setDeleted(true);
        post_3.setMedia(null);
        postRepository.save(post_3);

        Post post_4 = new Post();
        post_4.setAuthor(user);
        post_4.setContent("Postando a 7 dias");
        post_4.setCreatedAt(LocalDateTime.now().minusDays(7));
        post_4.setMedia(null);
        postRepository.save(post_4);

        User loggedUser = createTestUser("Teste", "teste@email.com", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post_5 = new Post();
        post_5.setAuthor(loggedUser);
        post_5.setContent("Postagem de outro usuário");
        post_5.setCreatedAt(LocalDateTime.now());
        postRepository.save(post_5);

        Page<PostResponseDTO> response = postService.getUserPosts(user.getId(), new PostFilterRequestDTO(
                null, null, null, null));

        assertNotNull(response);
        assertEquals(2, response.getTotalElements());
        assertEquals(1, response.getTotalPages());
        assertEquals(10, response.getSize());
        assertEquals("Postando a 10 minutos e editado", response.getContent().getFirst().content());
        assertTrue(response.getContent().getFirst().edited());
        assertEquals(1, response.getContent().getFirst().media().size());
        assertEquals("Postando a 7 dias", response.getContent().get(1).content());
        assertFalse(response.getContent().stream()
                .anyMatch(post -> post.content().equals("Postagem apagada")));
        assertFalse(response.getContent().stream()
                .anyMatch(post -> post.content().equals("Postagem de outro usuario")));
        assertFalse(response.getContent().stream()
                .anyMatch(post -> post.content().equals("Postando a uma hora e privado")));
    }

    @DisplayName("Listar posts da timeline")
    @Test
    void getTimelinePosts(){
        User user = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");

        Post post_1 = new Post();
        post_1.setAuthor(user);
        post_1.setContent("Postando a uma hora e privado");
        post_1.setVisibility(PostVisibility.PRIVADO);
        post_1.setCreatedAt(LocalDateTime.now().minusHours(1));
        postRepository.save(post_1);

        Post post_2 = new Post();
        post_2.setAuthor(user);
        post_2.setContent("Postando a 10 minutos e editado");
        post_2.setCreatedAt(LocalDateTime.now().minusMinutes(10));
        post_2.setEdited(true);
        postRepository.save(post_2);

        Media media = new Media();
        media.setPost(post_2);
        media.setMediaType(MediaType.IMAGE);
        media.setMimeType("image/jpg");
        media.setUrl("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        post_2.getMedia().add(media);
        mediaRepository.save(media);

        Post post_3 = new Post();
        post_3.setAuthor(user);
        post_3.setContent("Postagem apagada");
        post_3.setCreatedAt(LocalDateTime.now());
        post_3.setDeleted(true);
        post_3.setMedia(null);
        postRepository.save(post_3);

        Post post_4 = new Post();
        post_4.setAuthor(user);
        post_4.setContent("Postando a 7 dias");
        post_4.setCreatedAt(LocalDateTime.now().minusDays(7));
        post_4.setMedia(null);
        postRepository.save(post_4);

        User loggedUser = createTestUser("Teste", "teste@email.com", "@teste");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post_5 = new Post();
        post_5.setAuthor(loggedUser);
        post_5.setContent("Postagem pública do usuário logado");
        post_5.setCreatedAt(LocalDateTime.now().minusMinutes(5));
        postRepository.save(post_5);

        Post post_6 = new Post();
        post_6.setAuthor(loggedUser);
        post_6.setContent("Postagem privada do usuário logado");
        post_6.setCreatedAt(LocalDateTime.now().minusMinutes(3));
        postRepository.save(post_6);

        Page<PostResponseDTO> response = postService.getTimelinePosts(new PostFilterRequestDTO(
                null, null, null, null));

        assertNotNull(response);
        assertEquals(4, response.getTotalElements());
        assertEquals(1, response.getTotalPages());
        assertEquals(10, response.getSize());
        assertEquals("Postagem privada do usuário logado", response.getContent().getFirst().content());
        assertEquals(loggedUser.getId(), response.getContent().getFirst().idAuthor());
        assertEquals("Postagem pública do usuário logado", response.getContent().get(1).content());
        assertEquals(loggedUser.getId(), response.getContent().get(1).idAuthor());
        assertEquals("Postando a 10 minutos e editado", response.getContent().get(2).content());
        assertEquals(user.getId(), response.getContent().get(2).idAuthor());
        assertTrue(response.getContent().get(2).edited());
        assertEquals(1, response.getContent().get(2).media().size());
        assertEquals("Postando a 7 dias", response.getContent().get(3).content());
        assertEquals(user.getId(), response.getContent().get(3).idAuthor());
        assertFalse(response.getContent().stream()
                .anyMatch(post -> post.content().equals("Postagem apagada")));
        assertFalse(response.getContent().stream()
                .anyMatch(post -> post.content().equals("Postando a uma hora e privado")));
    }
}