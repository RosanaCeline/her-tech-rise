package com.hertechrise.platform.services;
import com.cloudinary.Cloudinary;
import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.data.dto.response.UserPictureResponseDTO;
import com.hertechrise.platform.exception.*;
import com.hertechrise.platform.integrationtests.testcontainers.AbstractIntegrationTest;
import com.hertechrise.platform.model.Role;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.model.UserType;
import com.hertechrise.platform.repository.RoleRepository;
import com.hertechrise.platform.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ContextConfiguration(initializers = DotenvInitializer.class)
class UserServiceTest extends AbstractIntegrationTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @DisplayName("Deve gerar um Handle único para cada usuário")
    @Test
    void generateUniqueUserHandleSuccess() {
        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);

        User user = new User();
        user.setName("Cláudia Souza");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("claudia@test.com");
        user.setPassword("senhasegura1234");
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");
        user.setRole(role);

        String handle = userService.generateUniqueUserHandle("Cláudia Souza");
        user.setHandle(handle);
        userRepository.save(user);
        assertThat(handle)
                .startsWith("@claudiasouza")
                .hasSizeLessThanOrEqualTo(15);

    }
    @DisplayName("Deve gerar handle com sufixo numérico quando handle já existe ")
    @Test
    void HandleExistente() {

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);

        User user = new User();
        user.setName("Cláudia Souza");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("claudiaf@test.com");
        user.setPassword("senhasegura1234");
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");
        user.setHandle("@claudiasouza");
        user.setRole(role);
        userRepository.save(user);

        String handle = userService.generateUniqueUserHandle("Cláudia Souza");
        assertThat(handle)
                .startsWith("@claudiasouza")
                .matches("@claudiasouza\\d{1,2}");
        assertThat(handle).isEqualTo("@claudiasouza1");

    }
    @Test
    @DisplayName("Handles com nomes com mais de 14 caracteres")
    void shouldTruncateLongNames() {
        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);

        User user = new User();
        user.setName("abcdefghijklmnopqrstuvwxyz");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("abcde@test.com");
        user.setPassword("senhasegura1234");
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");
        user.setRole(role);

        String handle = userService.generateUniqueUserHandle("abcdefghijklmnopqrstuvwxyz");
        assertThat(handle)
                .hasSize(15)
                .isEqualTo("@abcdefghijklmn");

    }

    @DisplayName("Atualizar foto perfil de usuário logado")
    @Test
    void updateProfilePicture()throws IOException {
        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);

        User user = new User();
        user.setName("Cláudia Souza");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("claudiaf@test.com");
        user.setPassword("senhasegura1234");
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");
        user.setHandle("@claudiasouza");
        user.setRole(role);
        userRepository.save(user);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        InputStream inputStream = getClass().getResourceAsStream("/imageTestCloudinary.png");
        MultipartFile multipartFile = new MockMultipartFile(
                "file",
                "imageTestCloudinary.png",
                "image/png",
                inputStream
        );
        UserPictureResponseDTO response = userService.updateProfilePicture(multipartFile);
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertThat(response).isNotNull();
        assertThat(response.profilePic()).startsWith("https://res.cloudinary.com");

        System.out.println("Imagem enviada para: " + response.profilePic());
    }

    @DisplayName("Deve lançar CloudinaryUploadException para falha de Upload para Cloudinary")
    @Test
    void CloudinaryUploadException(){

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "image.png",
                "image/png",
                new byte[0]
        );

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);

        User user = new User();
        user.setName("Thais");
        user.setEmail("thais@test.com");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua A");
        user.setNeighborhood("Centro");
        user.setPassword("senhasegura123");
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");
        user.setHandle("@thaisaraujo");
        user.setRole(role);

        userRepository.save(user);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);


        CloudinaryUploadException exception= assertThrows(CloudinaryUploadException.class,
                () -> userService.updateProfilePicture(file));

        assertEquals("Erro ao enviar arquivo para Cloudinary.",exception.getMessage());

    }

    @DisplayName("Deve lançar InvalidFileTypeException para arquivo com imagem inválida")
    @Test
    void InvalidFileTypeException(){
        MockMultipartFile arquivoInvalido = new MockMultipartFile(
                "file",
                "documento.pdf",
                "application/pdf",
                "conteudo teste".getBytes()
        );

        InvalidFileTypeException excecao = assertThrows(
                InvalidFileTypeException.class,
                () -> userService.updateProfilePicture(arquivoInvalido)
        );

        assertEquals("O arquivo enviado não é uma imagem válida.", excecao.getMessage());

    }

    @DisplayName("Desativar a própria conta")
    @Test
    void deactivateMyProfileSuccess(){
        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);

        // criando user
        User user = new User();
        user.setName("Cláudia Souza");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("claudiaf@test.com");
        user.setPassword("senhasegura1234");
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");
        user.setHandle("@claudiasouza");
        user.setRole(role);
        userRepository.save(user);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        userService.deactivateMyProfile();
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertFalse(updatedUser.isEnabled());
        assertFalse(updatedUser.isAccountNonLocked());

    }



    @DisplayName("Lançar UserNotFoundException para não conseguir desativa conta não encontrada ")
    @Test
    void UserNotFoundException(){
        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);

        User user = new User();
        user.setId(999L);
        user.setName("Cláudia Souza");
        user.setPhoneNumber("8800000002");
        user.setCep("62320000");
        user.setCity("Tianguá");
        user.setStreet("Rua Joaquim");
        user.setNeighborhood("Centro");
        user.setEmail("claudiaf@test.com");
        user.setPassword("senhasegura1234");
        user.setType(UserType.PROFESSIONAL);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");
        user.setUf("CE");
        user.setHandle("@claudiasouza");
        user.setRole(role);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        UserNotFoundException exception = assertThrows(UserNotFoundException.class,
                () -> userService.deactivateMyProfile()
        );

        assertEquals("Usuário autenticado não encontrado.", exception.getMessage());
    }


}