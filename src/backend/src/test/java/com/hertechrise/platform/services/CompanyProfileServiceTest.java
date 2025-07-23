package com.hertechrise.platform.services;
import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.data.dto.response.CompanyProfileResponseDTO;
import com.hertechrise.platform.data.dto.request.RegisterCompanyRequestDTO;
import com.hertechrise.platform.data.dto.response.CompanyProfileResponseDTO;
import com.hertechrise.platform.data.dto.response.TokenResponseDTO;
import com.hertechrise.platform.exception.InvalidUserTypeException;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.UserRepository;
import com.hertechrise.platform.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
@Transactional
@Rollback
@ContextConfiguration(initializers = DotenvInitializer.class)
class CompanyProfileServiceTest extends AbstractIntegrationTest {

    @Autowired
    private CompanyProfileService companyProfileService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private FollowRelationshipRepository followRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private RoleRepository roleRepository;
    @AfterEach
    void cleanUp() {
        postRepository.deleteAll();
        followRepository.deleteAll();
        companyRepository.deleteAll();
        userRepository.deleteAll();
    }
    @DisplayName("Deve retorna o perfil da empresa")
    @Test
    void getProfile() {

        User newUser = new User();
        newUser.setName("HerTech");
        newUser.setEmail("hertech@empresa.com");
        newUser.setPassword("senhasegura");
        newUser.setPhoneNumber("88 900000000");
        newUser.setStreet("teste");
        newUser.setNeighborhood("test");
        newUser.setCity("Tianguá");
        newUser.setCep("62320000");
        newUser.setUf("CE");
        newUser.setExternalLink("");
        newUser.setType(UserType.COMPANY);
        newUser.setHandle("@hertech");
        newUser.setProfilePic("https://res.cloudinary.com/dl63ih00u/image/upload/v1752625413/default_profile_company_qizndf.png");

        Role role = roleRepository.findByName("COMPANY")
                .orElseThrow(InvalidUserTypeException::new);
        newUser.setRole(role);

        userRepository.save(newUser);
        User user2 = new User();
        user2.setName("Her");
        user2.setEmail("hert@empresa.com");
        user2.setHandle("@her");
        user2.setUf("CE");
        user2.setCity("Tianguá");
        user2.setPhoneNumber("88 900000001");
        user2.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user2.setCep("62320000");
        user2.setNeighborhood("test");
        user2.setPassword("senhasegura123");
        user2.setStreet("test");
        user2.setType(UserType.COMPANY);
        user2.setRole(role);
        userRepository.save(user2);

        Company company = new Company();
        company.setUser(newUser);
        company.setCnpj("12.345.678/0001-95");
        company.setCompanyType(CompanyType.NACIONAL);
        company.setDescription("Inovação,igualdade e oportunidade");
        company.setAboutUs("Transformamos o mundo");

        companyRepository.save(company);

        // Configuração de autenticação (simula autenticação (login) ja que o codigo inicial pede
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(newUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        // Criar relação de follow dos users
        //se seguindo
        FollowRelationship follow = new FollowRelationship();
        follow.setFollower(user2); //quem segue
        follow.setFollowing(newUser); // quem é seguido
        follow.setFollowedAt(LocalDateTime.now());
        followRepository.saveAndFlush(follow);
        followRepository.save(follow);

        // Criar post aleatorio
        Post post = new Post();
        post.setAuthor(userRepository.findByEmail("hertech@empresa.com").orElseThrow());
        post.setContent("Lançamento de novas vagas!");
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        // Executar (chamando o metodo)

        CompanyProfileResponseDTO response = companyProfileService.getProfile(newUser.getId());

        // Verificações as saidas e banco
        assertNotNull(response);
        assertEquals("HerTech", response.name());
        assertEquals("@hertech", response.handle());
        assertEquals("Tianguá", response.city());
        assertEquals("CE", response.uf());
        assertEquals(CompanyType.NACIONAL, response.companyType());
        assertEquals("Inovação,igualdade e oportunidade", response.description());
        assertEquals("Transformamos o mundo", response.aboutUs());
        assertEquals(1L, response.followersCount());
        assertFalse(response.posts().isEmpty());
        assertEquals("Lançamento de novas vagas!", response.posts().get(0).content());
    }


}