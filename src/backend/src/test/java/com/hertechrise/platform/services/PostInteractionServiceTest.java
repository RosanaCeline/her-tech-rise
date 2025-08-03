package com.hertechrise.platform.services;
import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.data.dto.response.PostLikeResponseDTO;
import com.hertechrise.platform.exception.InvalidUserTypeException;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import com.hertechrise.platform.data.dto.request.PostCommentRequestDTO;
import com.hertechrise.platform.data.dto.request.PostShareRequestDTO;
import com.hertechrise.platform.data.dto.response.PostCommentResponseDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@Transactional
@ContextConfiguration(initializers = DotenvInitializer.class)
class PostInteractionServiceTest extends AbstractIntegrationTest {
    @Autowired
    private  PostRepository postRepository;
    @Autowired
    private PostLikeRepository likeRepository;
    @Autowired
    private PostCommentRepository commentRepository;
    @Autowired
    private PostShareRepository shareRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PostInteractionService postInteractionService;

    @AfterEach
    void clean() {
        shareRepository.deleteAll();
        commentRepository.deleteAll();
        likeRepository.deleteAll();
        postRepository.deleteAll();
        userRepository.deleteAll();
    }

    //criando User
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

    @DisplayName("Deve adcionar ou remover like de uma postagem")
    @Test
    void toggleLikeSuccess() {

        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        postInteractionService.toggleLike(post.getId());
        assertEquals(1, likeRepository.countByPostId(post.getId()));
        assertTrue(likeRepository.findByUserAndPost(loggedUser, post).isPresent());

        postInteractionService.toggleLike(post.getId());
        assertEquals(0, likeRepository.countByPostId(post.getId()));
        assertFalse(likeRepository.findByUserAndPost(loggedUser, post).isPresent());
    }

    @DisplayName("Deve adiciona um comentário a uma postagem")
    @Test
    void comment() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        PostCommentRequestDTO request = new PostCommentRequestDTO(
                "Ótimo post!",
                null
        );
        PostCommentResponseDTO response = postInteractionService.comment(post.getId(), request);

        assertNotNull(response);
        assertEquals("Ótimo post!", response.content());
        assertEquals(loggedUser.getName(), response.userName());
        assertEquals(1, commentRepository.countByPostId(post.getId()));


    }

    @DisplayName("Deve compartilha uma postagem com um comentário.")
    @Test
    void share() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        PostShareRequestDTO request = new PostShareRequestDTO("Vejam este post test!");

        postInteractionService.share(post.getId(), request);

        assertEquals(1, shareRepository.count());
        List<PostShare> shares = shareRepository.findAll()
                .stream()
                .filter(share -> share.getPost().getId().equals(post.getId()))
                .collect(Collectors.toList());

    }

    @DisplayName("Deve exclui um comentário do próprio post")
    @Test
    void deleteComment() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);


        PostCommentRequestDTO request = new PostCommentRequestDTO(
                "comentario para deletar test ",
                null
        );
        PostCommentResponseDTO comment = postInteractionService.comment(post.getId(), request);
        assertEquals(1, commentRepository.countByPostId(post.getId()));

        postInteractionService.deleteComment(comment.id());

        assertEquals(0, commentRepository.countByPostId(post.getId()));
    }

    @DisplayName("Deve exclui um compartilhamento")
    @Test
    void deleteShare() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        PostShareRequestDTO request = new PostShareRequestDTO("Compartilhamento para deletar");
        postInteractionService.share(post.getId(), request);

        List<PostShare> shares = shareRepository.findAll()
                .stream()
                .filter(share -> share.getPost() != null && share.getPost().getId().equals(post.getId()))
                .collect(Collectors.toList());


        assertFalse(shares.isEmpty());

        PostShare shareToDelete = shares.get(0);

        postInteractionService.deleteShare(shareToDelete.getId());

        assertEquals(0, shareRepository.count());

    }

    @DisplayName("Deve Lista todos os likes de uma postagem.")
    @Test
    void listLikes() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        postInteractionService.toggleLike(post.getId());

        List<PostLikeResponseDTO> likes = postInteractionService.listLikes(post.getId());

        assertEquals(1, likes.size());
        assertEquals(loggedUser.getName(), likes.get(0).userName());

    }
    @DisplayName("Deve listar todos os comentários de uma postagem")
    @Test
    void listComments() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);


        postInteractionService.comment(post.getId(),  new PostCommentRequestDTO(
                "Primeiro",
                null
        ));
        postInteractionService.comment(post.getId(), new PostCommentRequestDTO(
                "Segundo",
                null
        ));

        List<PostCommentResponseDTO> comments = postInteractionService.listComments(post.getId());

        assertEquals(2, comments.size());
        assertEquals("Primeiro", comments.get(0).content());
        assertEquals("Segundo", comments.get(1).content());
    }

    @DisplayName("Deve lançar exceção ao listar comentários de post inexistente")
    @Test
    void listCommentsShouldThrowWhenPostNotFound() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            postInteractionService.listComments(999L);
        });

        assertEquals("Postagem não encontrada", exception.getMessage());
    }

    @DisplayName("Deve contar quantos likes o post publicado possui ")
    @Test
    void countLikes() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);


        assertEquals(0, postInteractionService.countLikes(post.getId()));

        postInteractionService.toggleLike(post.getId());

        assertEquals(1, postInteractionService.countLikes(post.getId()));
    }

    @DisplayName("Deve contar quantos comentários o post possui")
    @Test
    void countComments() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        assertEquals(0, postInteractionService.countComments(post.getId()));

        postInteractionService.comment(post.getId(),  new PostCommentRequestDTO(
                "teste",
                null
        ));
        postInteractionService.comment(post.getId(),  new PostCommentRequestDTO(
                "teste2",
                null
        ));
        assertEquals(2, postInteractionService.countComments(post.getId()));

    }

    @DisplayName("Deve contar quantos compartilhamentos o post possui ")
    @Test
    void countShares() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);


        assertEquals(0, postInteractionService.countShares(post.getId()));

        postInteractionService.share(post.getId(), new PostShareRequestDTO("Teste"));
        assertEquals(1, postInteractionService.countShares(post.getId()));
    }

    @DisplayName("Não deve permitir deletar comentário de outro usuário em post de outro usuário")
    @Test
    void deleteCommentShouldThrowWhenUserNotOwnerNorAuthor() {
       //dona do post
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //criando post
        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        // usuario 2 comenta
        User otherUser2 = createTestUser("Claudia", "test@email.com", "@claudia");
        UsernamePasswordAuthenticationToken auth1 =
                new UsernamePasswordAuthenticationToken(otherUser2, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth1);

        PostCommentResponseDTO comment = postInteractionService.comment(post.getId(),  new PostCommentRequestDTO(
                "comentario de outro usuario",
                null
        ));
        // user 3
        User otherUser3 = createTestUser("Rosana ", "teste@email.com", "@Rosana");
        UsernamePasswordAuthenticationToken auth3 =
                new UsernamePasswordAuthenticationToken(otherUser3, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth3);

        SecurityException exception = assertThrows(SecurityException.class, () -> {
            postInteractionService.deleteComment(comment.id());
        });

        assertEquals("Você não tem permissão para excluir este comentário", exception.getMessage());
    }



    @DisplayName("Deve lançar exceção ao curtir post inexistente")
    @Test
    void toggleLikeShouldThrowWhenPostNotFound() {

        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            postInteractionService.toggleLike(999L); // id de post inexistente
        });

        assertEquals("Postagem não encontrada", exception.getMessage());
    }


    @DisplayName("Deve lançar exceção ao comentar post inexistente")
    @Test
    void commentShouldThrowWhenPostNotFound() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        PostCommentRequestDTO request =  new PostCommentRequestDTO(
                "comentario inexistente",
                null
        );
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            postInteractionService.comment(999L, request);
        });

        assertEquals("Postagem não encontrada", exception.getMessage());
    }

    //ok
    @DisplayName("Deve lançar exceção ao compartilhar post inexistente")
    @Test
    void shareShouldThrowWhenPostNotFound() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        PostShareRequestDTO request = new PostShareRequestDTO("Compartilhar");
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            postInteractionService.share(999L, request);
        });

        assertEquals("Postagem não encontrada", exception.getMessage());
    }

    @DisplayName("Deve lançar exceção ao deletar comentário inexistente")
    @Test
    void deleteCommentShouldThrowWhenNotFound() {

        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            postInteractionService.deleteComment(999L);
        });

        assertEquals("Comentário não encontrado", exception.getMessage());
    }

    @DisplayName("Deve lançar exceção ao deletar compartilhamento inexistente")
    @Test
    void deleteShareShouldThrowWhenNotFound() {

        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            postInteractionService.deleteShare(999L);
        });

        assertEquals("Compartilhamento não encontrado", exception.getMessage());
    }

    @DisplayName("Não deve permitir deletar compartilhamento de outro usuário")
    @Test
    void shouldNotDeleteOtherUserShare() {

        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        User otherUser = createTestUser("Claudia", "teste@email.com", "@claudia");
        UsernamePasswordAuthenticationToken otherAuth =
                new UsernamePasswordAuthenticationToken(otherUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(otherAuth);

        postInteractionService.share(post.getId(), new PostShareRequestDTO("Compartilhamento teste"));

        Optional<PostShare> share = shareRepository.findAll()
                .stream()
                .filter(s -> s.getUser().getId().equals(otherUser.getId()))
                .findFirst();

        assertTrue(share.isPresent(), "Compartilhamento deveria existir");

        SecurityContextHolder.getContext().setAuthentication(auth);

        SecurityException exception = assertThrows(SecurityException.class, () -> {
            postInteractionService.deleteShare(share.get().getId());
        });

        assertEquals("Você não tem permissão para excluir este compartilhamento", exception.getMessage());

    }

    @DisplayName("Deve lançar exceção ao listar likes de post inexistente")
    @Test
    void listLikesShouldThrowWhenPostNotFound() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            postInteractionService.listLikes(999L);
        });

        assertEquals("Postagem não encontrada", exception.getMessage());
    }
    @DisplayName("Deve curtir e descurtir comentário de um post")
   @Test
    void toggleCommentLike() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Post para curtir e comentar");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        PostCommentRequestDTO request = new PostCommentRequestDTO(
                "comentario teste",
                null
        );

        PostCommentResponseDTO comment = postInteractionService.comment(post.getId(), request);
        Long comId = comment.id();
        postInteractionService.toggleCommentLike(comId);
        assertEquals(1L, postInteractionService.countCommentLikes(comId));

        postInteractionService.toggleCommentLike(comId);
        assertEquals(0L, postInteractionService.countCommentLikes(comId));
    }


    @DisplayName("Deve curtir e descurtir um compartilhamento")
    @Test
    void toggleShareLike() {
        User user = createTestUser("Cláudia", "claudia@email.com", "@claudia");
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, List.of())
        );

        Post post = new Post();
        post.setAuthor(user);
        post.setContent("Post para compartilhar");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        postInteractionService.share(post.getId(), new PostShareRequestDTO("Compartilhando para curtir"));

        PostShare share = shareRepository.findAll().get(0);

        postInteractionService.toggleShareLike(share.getId());
        assertEquals(1L, postInteractionService.countShareLikes(share.getId()));

        postInteractionService.toggleShareLike(share.getId());
        assertEquals(0L, postInteractionService.countShareLikes(share.getId()));
    }
    @DisplayName("Deve listar curtidas de um comentário")
    @Test
    void listCommentLikes() {

    }
    @DisplayName("Deve lançar  EntityNotFoundException ao comentar com parentCommentId inexistente")
    @Test
    void commentShouldThrowWhenParentCommentNotFound() {
        User loggedUser = createTestUser("Thalyta", "thalyta@email.com", "@thalyta");
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent("Olá mundo");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        PostCommentRequestDTO request = new PostCommentRequestDTO("comentário inexistente", 999L);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            postInteractionService.comment(post.getId(), request);
        });

        assertEquals("Comentário pai não encontrado", exception.getMessage());


    }





}