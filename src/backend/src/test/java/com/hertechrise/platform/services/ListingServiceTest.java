package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.response.MainListingResponseDTO;
import com.hertechrise.platform.data.dto.response.PagedResponseDTO;
import com.hertechrise.platform.data.dto.response.UserSummaryResponseDTO;
import com.hertechrise.platform.model.Role;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.model.UserType;
import com.hertechrise.platform.repository.CompanyRepository;
import com.hertechrise.platform.repository.ProfessionalRepository;
import com.hertechrise.platform.repository.RoleRepository;
import com.hertechrise.platform.repository.UserRepository;
import com.hertechrise.platform.exception.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import static org.junit.jupiter.api.Assertions.*;
import java.util.List;

@SpringBootTest
class ListingServiceTest {
    @Autowired
    private ListingService listingService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private ProfessionalRepository  professionalRepository;
    @Autowired
    private CompanyRepository companyRepository;

    @BeforeEach
    void cleanUpDatabase(){
        professionalRepository.deleteAll();
        companyRepository.deleteAll();
        userRepository.deleteAll();
    }

    private User createTestUser(String name, String email, String handle, String user_role) {
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
        user.setType(user_role.equals("PROFESSIONAL") ? UserType.PROFESSIONAL : UserType.COMPANY);
        user.setProfilePic("https://res.cloudinary.com/ddotqrebs/image/upload/v1751250361/default_profile_company_kpqrxc.png");

        Role role = roleRepository.findByName(user_role)
                .orElseThrow(InvalidUserTypeException::new);
        user.setRole(role);

        return userRepository.save(user);
    }

    @DisplayName("Pesquisar todos os usuários, em ordem alfabética")
    @Test
    void searchAllUsers(){
        List<User> users = List.of(
            createTestUser("Ana Beatriz", "ana.beatriz@test.com", "anabea123", "PROFESSIONAL"),
            createTestUser("Carlos Henrique", "carlos.henrique@test.com", "carlosh123", "PROFESSIONAL"),
            createTestUser("Fernanda Souza", "fernanda.souza@test.com", "fer.souza", "PROFESSIONAL"),
            createTestUser("Gabriel Silva", "gabriel.silva@test.com", "gabsi123", "PROFESSIONAL"),
            createTestUser("Juliana Andrade", "juliana.andrade@test.com", "julianaa", "PROFESSIONAL"),
            createTestUser("Lucas Lima", "lucas.lima@test.com", "lucaslima", "PROFESSIONAL"),
            createTestUser("Mariana Costa", "mariana.costa@test.com", "marianacosta", "PROFESSIONAL"),
            createTestUser("TechRise Solutions", "contact@techrise.com", "techriseco", "COMPANY"),
            createTestUser("Inova Systems", "suporte@inovasystems.com", "inovasys", "COMPANY"),
            createTestUser("DeltaTech LTDA", "contato@deltatech.com", "deltaco", "COMPANY"),
            createTestUser("FuturaSoft", "atendimento@futurasoft.com", "futurasoft", "COMPANY"),
            createTestUser("NeoWave Tech", "info@neowave.com", "neowave", "COMPANY"),
            createTestUser("BrightLabs", "hello@brightlabs.com", "brightlabs", "COMPANY"),
            createTestUser("CodeFlow Inc.", "dev@codeflow.com", "codeflow", "COMPANY")
        );

        MainListingResponseDTO result = listingService.mainListing(null);

        assertNotNull(result);
        assertEquals(6, result.professionals().size());
        assertEquals(6, result.companies().size());
        assertEquals("Ana Beatriz", result.professionals().getFirst().name());
        assertEquals("BrightLabs", result.companies().getFirst().name());
    }

    @DisplayName("Pesquisar usuários pelo nome")
    @Test
    void searchUsersByName(){
        List<User> users = List.of(
            createTestUser("Ana Beatriz", "ana.beatriz@test.com", "anabea123", "PROFESSIONAL"),
            createTestUser("Carlos Henrique", "carlos.henrique@test.com", "carlosh123", "PROFESSIONAL"),
            createTestUser("Fernanda Souza", "fernanda.souza@test.com", "fer.souza", "PROFESSIONAL"),
            createTestUser("Gabriel Silva", "gabriel.silva@test.com", "gabsi123", "PROFESSIONAL"),
            createTestUser("Juliana Andrade", "juliana.andrade@test.com", "julianaa", "PROFESSIONAL"),
            createTestUser("Lucas Lima", "lucas.lima@test.com", "lucaslima", "PROFESSIONAL"),
            createTestUser("Mariana Costa", "mariana.costa@test.com", "marianacosta", "PROFESSIONAL"),
            createTestUser("TechRise Solutions", "contact@techrise.com", "techriseco", "COMPANY"),
            createTestUser("Inova Systems", "suporte@inovasystems.com", "inovasys", "COMPANY"),
            createTestUser("DeltaTech LTDA", "contato@deltatech.com", "deltaco", "COMPANY"),
            createTestUser("FuturaSoft", "atendimento@futurasoft.com", "futurasoft", "COMPANY"),
            createTestUser("NeoWave Tech", "info@neowave.com", "neowave", "COMPANY"),
            createTestUser("BrightLabs", "hello@brightlabs.com", "brightlabs", "COMPANY"),
            createTestUser("CodeFlow Inc.", "dev@codeflow.com", "codeflow", "COMPANY")
        );

        MainListingResponseDTO result = listingService.mainListing("Ca");

        assertNotNull(result);
        assertEquals(2, result.professionals().size());
        assertEquals(0, result.companies().size());
    }

    @DisplayName("Pesquisar profissionais pelo nome, aplicando paginação")
    @Test
    void searchProfessionalsByNameAndPage(){
        List<User> professionals = List.of(
                createTestUser("Carlos Henrique", "carlos.henrique@test.com", "carlosh123", "PROFESSIONAL"),
            createTestUser("Ana Beatriz", "ana.beatriz@test.com", "anabea123", "PROFESSIONAL"),
            createTestUser("Fernanda Souza", "fernanda.souza@test.com", "fer.souza", "PROFESSIONAL"),
            createTestUser("Gabriela Lima", "gabriela.lima@test.com", "gablima123", "PROFESSIONAL"),
            createTestUser("Juliana Andrade", "juliana.andrade@test.com", "julianaa", "PROFESSIONAL"),
            createTestUser("Lucas Matos", "lucas.matos@test.com", "lucasm123", "PROFESSIONAL"),
            createTestUser("Mariana Costa", "mariana.costa@test.com", "marianacosta", "PROFESSIONAL"),
            createTestUser("Patricia Gomes", "patricia.gomes@test.com", "patgomes123", "PROFESSIONAL"),
            createTestUser("Tatiane Rocha", "tatiane.rocha@test.com", "tatiana123", "PROFESSIONAL"),
            createTestUser("Natalia Freitas", "natalia.freitas@test.com", "natalia123", "PROFESSIONAL"),
            createTestUser("Santiago Ramos", "santiago.ramos@test.com", "santiago123", "PROFESSIONAL"),
            createTestUser("Matheus Oliveira", "matheus.oliveira@test.com", "matheus123", "PROFESSIONAL"),
            createTestUser("Tarcisio Lima", "tarcisio.lima@test.com", "tarcisio123", "PROFESSIONAL"),
            createTestUser("Tabata Silva", "tabata.silva@test.com", "tabata123", "PROFESSIONAL"),
            createTestUser("Aline Ferreira", "aline.ferreira@test.com", "alinef123", "PROFESSIONAL"),
            createTestUser("Renata Borges", "renata.borges@test.com", "renatab123", "PROFESSIONAL"),
            createTestUser("Beatriz Farias", "beatriz.farias@test.com", "beafarias123", "PROFESSIONAL"),
            createTestUser("Clara Mendes", "clara.mendes@test.com", "claram123", "PROFESSIONAL"),
            createTestUser("Larissa Monteiro", "larissa.monteiro@test.com", "larissam123", "PROFESSIONAL"),
            createTestUser("Daniela Lopes", "daniela.lopes@test.com", "danielal123", "PROFESSIONAL"),
            createTestUser("Felipe Costa", "felipe.costa@test.com", "felipec123", "PROFESSIONAL"),
            createTestUser("Henrique Torres", "henrique.torres@test.com", "henriquet123", "PROFESSIONAL"), // sem "a"
            createTestUser("Otto Mendes", "otto.mendes@test.com", "ottom123", "PROFESSIONAL"), // sem "a"
            createTestUser("Isabela Cunha", "isabela.cunha@test.com", "isabelac123", "PROFESSIONAL"),
            createTestUser("Tatiana Lopes", "tatiana.lopes@test.com", "tatianal123", "PROFESSIONAL")
        );

        PagedResponseDTO<UserSummaryResponseDTO> result = listingService.pageProfessionals("a", PageRequest.of(0, 20, Sort.by("name")));

        assertEquals(20, result.content().size());
        assertEquals(2, result.totalPages());
        assertEquals("Aline Ferreira", result.content().getFirst().name());
        assertFalse(result.content().stream().anyMatch(user -> user.name().equals("Henrique Torres")));
        assertFalse(result.content().stream().anyMatch(user -> user.name().equals("Otto Mendes")));
    }

    @DisplayName("Pesquisar empresas pelo nome")
    @Test
    void searchCompaniesByNameAndPage(){
        List<User> companies = List.of(
            createTestUser("TechRise Solutions", "contact@techrise.com", "techriseco", "COMPANY"),
            createTestUser("Inova Systems", "suporte@inovasystems.com", "inovasys", "COMPANY"),
            createTestUser("DeltaTech LTDA", "contato@deltatech.com", "deltaco", "COMPANY"),
            createTestUser("FuturaSoft", "atendimento@futurasoft.com", "futurasoft", "COMPANY"),
            createTestUser("NeoWave Tech", "info@neowave.com", "neowave", "COMPANY"),
            createTestUser("BrightLabs", "hello@brightlabs.com", "brightlabs", "COMPANY"),
            createTestUser("Meninas Code Inc.", "dev@codeflow.com", "codeflow", "COMPANY"),
            createTestUser("Optimum Corp", "contact@optimum.com", "optimum", "COMPANY"), // sem "a"
            createTestUser("BlueSky Tech", "info@bluesky.com", "bluesky", "COMPANY"),   // sem "a"
            createTestUser("GreenLeaf Solutions", "contact@greenleaf.com", "greenleaf", "COMPANY"),
            createTestUser("Skylane Technologies", "support@skyline.com", "skyline", "COMPANY"),
            createTestUser("Quantum Dynamics", "hello@quantumdynamics.com", "quantumdynamics", "COMPANY"),
            createTestUser("NexGen Innovations", "info@nexgen.com", "nexgen", "COMPANY"),
            createTestUser("Silverlane Systems", "contact@silverline.com", "silverline", "COMPANY"),
            createTestUser("Pinnacle Tech", "support@pinnacle.com", "pinnacle", "COMPANY"),
            createTestUser("Evargreen Solutions", "info@evergreen.com", "evergreen", "COMPANY"),
            createTestUser("Sammit Technologies", "hello@summit.com", "summit", "COMPANY"),
            createTestUser("Vertex Innovations", "contact@vertex.com", "vertex", "COMPANY"),
            createTestUser("Crastline Corp", "support@crestline.com", "crestline", "COMPANY"),
            createTestUser("Radiant Systems", "info@radiant.com", "radiant", "COMPANY"),
            createTestUser("Elevate Solutions", "hello@elevate.com", "elevate", "COMPANY"),
            createTestUser("Zanith Technologies", "contact@zenith.com", "zenith", "COMPANY"),
            createTestUser("Momentum Corpa", "support@momentum.com", "momentum", "COMPANY"),
            createTestUser("Summit Peak", "info@summitpeak.com", "summitpeak", "COMPANY"),
            createTestUser("Pulse Innovations", "hello@pulse.com", "pulse", "COMPANY")
        );

        PagedResponseDTO<UserSummaryResponseDTO> result = listingService.pageCompanies("a", PageRequest.of(0, 20, Sort.by("name")));

        assertEquals(20, result.content().size());
        assertEquals(2, result.totalPages());
        assertEquals("BrightLabs", result.content().getFirst().name());
        assertFalse(result.content().stream().anyMatch(user -> user.name().equals("Optimum Corp")));
        assertFalse(result.content().stream().anyMatch(user -> user.name().equals("BlueSky Tech")));
    }
}