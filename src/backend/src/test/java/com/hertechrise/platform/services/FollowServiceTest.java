package com.hertechrise.platform.services;
import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.data.dto.request.FollowRequestDTO;
import com.hertechrise.platform.data.dto.request.UnfollowRequestDTO;
import com.hertechrise.platform.data.dto.response.FollowResponseDTO;
import com.hertechrise.platform.exception.*;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.FollowRelationshipRepository;
import com.hertechrise.platform.repository.RoleRepository;
import com.hertechrise.platform.repository.UserRepository;
import com.hertechrise.platform.model.FollowRelationship;
import com.hertechrise.platform.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback
@ContextConfiguration(initializers = DotenvInitializer.class)
class FollowServiceTest extends AbstractIntegrationTest {

    //BD
    @Autowired
    private FollowService followService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRelationshipRepository followRepository;

    @Autowired
    private RoleRepository roleRepository;

    @DisplayName("Seguir outros usuários(follow")
    @Test
    void followUserSuccess() {
        //criando o user1
        User loggedUser = new User();
        loggedUser.setName("Cláudia");
        loggedUser.setEnabled(true);
        loggedUser.setUf("CE");
        loggedUser.setCep("62320000");
        loggedUser.setCity("Tiangua");
        loggedUser.setEmail("claudia@test.com");
        loggedUser.setNeighborhood("teste");
        loggedUser.setStreet("teste");
        loggedUser.setHandle("claudia123");
        loggedUser.setPhoneNumber("88900000000");
        loggedUser.setPassword("senhasegura123");
        loggedUser.setType(UserType.PROFESSIONAL);
        loggedUser.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        loggedUser.setRole(role);
        userRepository.save(loggedUser);

        // criando user2
        User user2 = new User();
        user2.setName("Lais Coutinho");
        user2.setEnabled(true);
        user2.setUf("CE");
        user2.setCep("62320000");
        user2.setCity("Tiangua");
        user2.setEmail("laiscoutinho@test.com");
        user2.setNeighborhood("centro");
        user2.setStreet("teste");
        user2.setHandle("laiscout");
        user2.setPhoneNumber("88900000000");
        user2.setPassword("senhasegura123");
        user2.setType(UserType.PROFESSIONAL);
        user2.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user2.setRole(role);
        userRepository.save(user2);

        //simula login
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //(chama o metodo follow service)
        FollowRequestDTO request = new FollowRequestDTO(user2.getId());
        FollowResponseDTO response = followService.follow(request);

        assertNotNull(response);
        assertNotNull(response.id());
        assertEquals(loggedUser.getId(), response.followerId());
        assertEquals(user2.getId(), response.followingId());
        assertNotNull(response.followedAt());
        assertTrue(followRepository.existsByFollowerAndFollowing(loggedUser, user2));
    }

    @DisplayName("Deve lançar SelfFollowException quando o usuário tentar seguir seu próprio perfil ")
    @Test
    void SelfFollowExceptionThrowsException(){

        User loggedUser = new User();
        loggedUser.setName("Cláudia");
        loggedUser.setEnabled(true);
        loggedUser.setUf("CE");
        loggedUser.setCep("62320000");
        loggedUser.setCity("Tiangua");
        loggedUser.setEmail("claudia@test.com");
        loggedUser.setNeighborhood("teste");
        loggedUser.setStreet("teste");
        loggedUser.setHandle("claudia123");
        loggedUser.setPhoneNumber("88900000000");
        loggedUser.setPassword("senhasegura123");
        loggedUser.setType(UserType.PROFESSIONAL);
        loggedUser.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        loggedUser.setRole(role);
        userRepository.save(loggedUser);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //auto-seguimento
        FollowRequestDTO request = new FollowRequestDTO(loggedUser.getId());

        Exception exception = assertThrows(SelfFollowException.class, () -> {
            followService.follow(request);
        });
        assertEquals("Você não pode seguir a si mesmo.", exception.getMessage());
        assertFalse(followRepository.existsByFollowerAndFollowing(loggedUser, loggedUser));
    }

    @DisplayName("Deve lançar followUserNotFound quando o usuário tentar seguir um usuário não encontrado")
    @Test
    void followUserNotFoundException(){
        
        User loggedUser = new User();
        loggedUser.setName("Cláudia");
        loggedUser.setEnabled(true);
        loggedUser.setUf("CE");
        loggedUser.setCep("62320000");
        loggedUser.setCity("Tiangua");
        loggedUser.setEmail("claudia@test.com");
        loggedUser.setNeighborhood("teste");
        loggedUser.setStreet("teste");
        loggedUser.setHandle("claudia123");
        loggedUser.setPhoneNumber("88900000000");
        loggedUser.setPassword("senhasegura123");
        loggedUser.setType(UserType.PROFESSIONAL);
        loggedUser.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        loggedUser.setRole(role);
        userRepository.save(loggedUser);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        // ID de usuário inesxistente
        FollowRequestDTO request = new FollowRequestDTO(99999L);

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            followService.follow(request);
        });

        assertEquals("Usuário autenticado não encontrado.", exception.getMessage());

    }

    @DisplayName("Deve lançar followAlreadyFollowing quando o usuário quando o usuário tentar seguir alguém que já segue")
    @Test
    void followAlreadyFollowingException(){

        User loggedUser = new User();
        loggedUser.setName("Cláudia");
        loggedUser.setEnabled(true);
        loggedUser.setUf("CE");
        loggedUser.setCep("62320000");
        loggedUser.setCity("Tiangua");
        loggedUser.setEmail("claudia@test.com");
        loggedUser.setNeighborhood("teste");
        loggedUser.setStreet("teste");
        loggedUser.setHandle("claudia123");
        loggedUser.setPhoneNumber("88900000000");
        loggedUser.setPassword("senhasegura123");
        loggedUser.setType(UserType.PROFESSIONAL);
        loggedUser.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        loggedUser.setRole(role);
        userRepository.save(loggedUser);

        User user2 = new User();
        user2.setName("Lais Coutinho");
        user2.setEnabled(true);
        user2.setUf("CE");
        user2.setCep("62320000");
        user2.setCity("Tiangua");
        user2.setEmail("laiscoutinho@test.com");
        user2.setNeighborhood("centro");
        user2.setStreet("teste");
        user2.setHandle("laiscout");
        user2.setPhoneNumber("88900000000");
        user2.setPassword("senhasegura123");
        user2.setType(UserType.PROFESSIONAL);
        user2.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        user2.setRole(role);
        userRepository.save(user2);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        FollowRequestDTO request = new FollowRequestDTO(user2.getId());
        followService.follow(request);

        assertTrue(followRepository.existsByFollowerAndFollowing(loggedUser, user2));
        AlreadyFollowingException exception = assertThrows(AlreadyFollowingException.class, () -> {
            followService.follow(request); // seguindo o user2 novamente
        });

        assertEquals("Você já segue esse usuário.", exception.getMessage());

    }


    //CAMINHO FELIZ
    @DisplayName("Deixar de seguir usuários (unfollow) com sucesso")
    @Test
    void unfollowSuccess() {

        //criando o user1
        User loggedUser = new User();
        loggedUser.setName("Cláudia");
        loggedUser.setEnabled(true);
        loggedUser.setUf("CE");
        loggedUser.setCep("62320000");
        loggedUser.setCity("Tiangua");
        loggedUser.setEmail("claudia@test.com");
        loggedUser.setNeighborhood("teste");
        loggedUser.setStreet("teste");
        loggedUser.setHandle("claudia123");
        loggedUser.setPhoneNumber("88900000000");
        loggedUser.setPassword("senhasegura123");
        loggedUser.setType(UserType.PROFESSIONAL);
        loggedUser.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        User user2 = new User();
        user2.setName("Lais Coutinho");
        user2.setEnabled(true);
        user2.setUf("CE");
        user2.setCep("62320000");
        user2.setCity("Tiangua");
        user2.setEmail("laiscoutinho@test.com");
        user2.setNeighborhood("centro");
        user2.setStreet("teste");
        user2.setHandle("laiscout");
        user2.setPhoneNumber("88900000000");
        user2.setPassword("senhasegura123");
        user2.setType(UserType.PROFESSIONAL);
        user2.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        loggedUser.setRole(role);
        user2.setRole(role);
        userRepository.save(loggedUser);
        userRepository.save(user2);

        // loggedUser ---> User2
        FollowRelationship follow = new FollowRelationship();
        follow.setFollower(loggedUser);
        follow.setFollowing(user2);
        follow.setFollowedAt(LocalDateTime.now());
        followRepository.save(follow);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        UnfollowRequestDTO request = new UnfollowRequestDTO(user2.getId());

        followService.unfollow(request);

        boolean exists = followRepository.existsByFollowerAndFollowing(loggedUser, user2);
        assertFalse(exists);

    }

    @DisplayName("Deve lançar SelfUnfollowException quando o usuário tentar dar Unfollow em si mesmo ")
    @Test
    void SelfUnfollowException(){

        User loggedUser = new User();
        loggedUser.setName("Cláudia");
        loggedUser.setEnabled(true);
        loggedUser.setUf("CE");
        loggedUser.setCep("62320000");
        loggedUser.setCity("Tiangua");
        loggedUser.setEmail("claudia@test.com");
        loggedUser.setNeighborhood("teste");
        loggedUser.setStreet("teste");
        loggedUser.setHandle("claudia123");
        loggedUser.setPhoneNumber("88900000000");
        loggedUser.setPassword("senhasegura123");
        loggedUser.setType(UserType.PROFESSIONAL);
        loggedUser.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        loggedUser.setRole(role);
        userRepository.save(loggedUser);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        UnfollowRequestDTO request = new UnfollowRequestDTO(loggedUser.getId());
        SelfUnfollowException exception = assertThrows(SelfUnfollowException.class, () -> {
            followService.unfollow(request);
        });
        assertEquals("Você não pode deixar de seguir a si mesmo.", exception.getMessage());
        assertEquals(0, followRepository.count());
    }

    @DisplayName("Deve lançar UserNotFoundException quando usuário tentar dar unfollow em um usuário não existente")
    @Test
    void unfollowUserNotFoundException(){

        User loggedUser = new User();
        loggedUser.setName("Cláudia");
        loggedUser.setEnabled(true);
        loggedUser.setUf("CE");
        loggedUser.setCep("62320000");
        loggedUser.setCity("Tiangua");
        loggedUser.setEmail("claudia@test.com");
        loggedUser.setNeighborhood("teste");
        loggedUser.setStreet("teste");
        loggedUser.setHandle("claudia123");
        loggedUser.setPhoneNumber("88900000000");
        loggedUser.setPassword("senhasegura123");
        loggedUser.setType(UserType.PROFESSIONAL);
        loggedUser.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        loggedUser.setRole(role);
        userRepository.save(loggedUser);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        UnfollowRequestDTO request = new UnfollowRequestDTO(99999L);
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            followService.unfollow(request);
        });

        assertEquals("Usuário autenticado não encontrado.", exception.getMessage());

    }

    @DisplayName("Deve lançar FollowNotFoundException quando o usuário tentar dar um Unfollow em alguém que nunca seguiu ")
    @Test
    void unfollowNonFollowedUser_shouldThrowException(){

        User loggedUser = new User();
        loggedUser.setName("Cláudia");
        loggedUser.setEnabled(true);
        loggedUser.setUf("CE");
        loggedUser.setCep("62320000");
        loggedUser.setCity("Tiangua");
        loggedUser.setEmail("claudia@test.com");
        loggedUser.setNeighborhood("teste");
        loggedUser.setStreet("teste");
        loggedUser.setHandle("claudia123");
        loggedUser.setPhoneNumber("88900000000");
        loggedUser.setPassword("senhasegura123");
        loggedUser.setType(UserType.PROFESSIONAL);
        loggedUser.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        loggedUser.setRole(role);
        userRepository.save(loggedUser);

        User user2 = new User();
        user2.setName("Lais Coutinho");
        user2.setEnabled(true);
        user2.setUf("CE");
        user2.setCep("62320000");
        user2.setCity("Tiangua");
        user2.setEmail("laiscoutinho@test.com");
        user2.setNeighborhood("centro");
        user2.setStreet("teste");
        user2.setHandle("laiscout");
        user2.setPhoneNumber("88900000000");
        user2.setPassword("senhasegura123");
        user2.setType(UserType.PROFESSIONAL);
        user2.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role1 = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        loggedUser.setRole(role1);
        user2.setRole(role1);
        userRepository.save(user2);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        UnfollowRequestDTO request = new UnfollowRequestDTO(user2.getId());

        FollowNotFoundException exception = assertThrows(FollowNotFoundException.class, () -> {
            followService.unfollow(request);
        });

        assertEquals("Você não segue este usuário.", exception.getMessage());

    }

    @DisplayName("Deve listar os usuários que o usuário logado está seguindo")
    @Test
    void listFollowing() {
        User loggedUser = new User();
        loggedUser.setName("Cláudia");
        loggedUser.setEnabled(true);
        loggedUser.setUf("CE");
        loggedUser.setCep("62320000");
        loggedUser.setCity("Tiangua");
        loggedUser.setEmail("claudia@test.com");
        loggedUser.setNeighborhood("teste");
        loggedUser.setStreet("teste");
        loggedUser.setHandle("claudia123");
        loggedUser.setPhoneNumber("88900000000");
        loggedUser.setPassword("senhasegura123");
        loggedUser.setType(UserType.PROFESSIONAL);
        loggedUser.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        loggedUser.setRole(role);
        userRepository.save(loggedUser);

        User user2 = new User();
        user2.setName("Lais Coutinho");
        user2.setEnabled(true);
        user2.setUf("CE");
        user2.setCep("62320000");
        user2.setCity("Tiangua");
        user2.setEmail("laiscoutinho@test.com");
        user2.setNeighborhood("centro");
        user2.setStreet("teste");
        user2.setHandle("laiscout");
        user2.setPhoneNumber("88900000000");
        user2.setPassword("senhasegura123");
        user2.setType(UserType.PROFESSIONAL);
        user2.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        user2.setRole(role);
        userRepository.save(user2);

        // loggedUser ---> User2
        FollowRelationship follow = new FollowRelationship();
        follow.setFollower(loggedUser);
        follow.setFollowing(user2);
        follow.setFollowedAt(LocalDateTime.now());
        followRepository.save(follow);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);


        List<FollowResponseDTO> response = followService.listFollowing();

        assertNotNull(response);
        assertEquals(1, response.size());

        FollowResponseDTO dto = response.get(0);
        assertEquals(follow.getId(), dto.id());
        assertEquals(loggedUser.getId(), dto.followerId()); // Quem segue
        assertEquals(user2.getId(), dto.followingId()); // Quem é seguido
        assertNotNull(dto.followedAt());
    }

    @DisplayName("Deve listar seguidores do usuário ")
    @Test
    void listFollowers() {

        User loggedUser = new User();
        loggedUser.setName("Cláudia");
        loggedUser.setEnabled(true);
        loggedUser.setUf("CE");
        loggedUser.setCep("62320000");
        loggedUser.setCity("Tiangua");
        loggedUser.setEmail("claudia@test.com");
        loggedUser.setNeighborhood("teste");
        loggedUser.setStreet("teste");
        loggedUser.setHandle("claudia123");
        loggedUser.setPhoneNumber("88900000000");
        loggedUser.setPassword("senhasegura123");
        loggedUser.setType(UserType.PROFESSIONAL);
        loggedUser.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        loggedUser.setRole(role);
        userRepository.save(loggedUser);

        User user2 = new User();
        user2.setName("Roberto");
        user2.setEnabled(true);
        user2.setUf("CE");
        user2.setCep("62320000");
        user2.setCity("Tiangua");
        user2.setEmail("roberto@test.com");
        user2.setNeighborhood("centro");
        user2.setStreet("teste");
        user2.setHandle("robert");
        user2.setPhoneNumber("88900000000");
        user2.setPassword("senhasegura123");
        user2.setType(UserType.PROFESSIONAL);
        user2.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        user2.setRole(role);
        userRepository.save(user2);

        // User2 ---> loggedUser
        FollowRelationship follow = new FollowRelationship();
        follow.setFollower(user2); // segue
        follow.setFollowing(loggedUser); //é seguido
        follow.setFollowedAt(LocalDateTime.now());
        followRepository.save(follow);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(loggedUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        List<FollowResponseDTO> response = followService.listFollowers();
        assertNotNull(response);

        FollowResponseDTO dto = response.get(0);
        assertEquals(follow.getId(), dto.id());
        assertEquals(user2.getId(), dto.followerId());
        assertEquals(loggedUser.getId(), dto.followingId());
        assertNotNull(dto.followedAt());

    }
    //falta testar private DTO
}