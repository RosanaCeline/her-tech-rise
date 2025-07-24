package com.hertechrise.platform.services;
import com.hertechrise.platform.data.dto.request.CompanyProfileRequestDTO;
import com.hertechrise.platform.data.dto.request.CompanyProfileRequestDTO;
import com.hertechrise.platform.data.dto.request.PostFilterRequestDTO;
import com.hertechrise.platform.data.dto.response.*;
import com.hertechrise.platform.exception.CompanyNotFoundException;
import com.hertechrise.platform.exception.UserNotFoundException;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.CompanyRepository;
import com.hertechrise.platform.repository.FollowRelationshipRepository;
import com.hertechrise.platform.repository.UserRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyProfileService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final FollowRelationshipRepository followRepository;

    private final PostService postService;

    public CompanyProfileResponseDTO getProfile(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        User user = userRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        Company company = companyRepository.findById(id)
                .orElseThrow(CompanyNotFoundException::new);

        long followersCount = followRepository.countByFollowing(user);

        PostFilterRequestDTO filter = new PostFilterRequestDTO(null, null, null, null);

        List<PostResponseDTO> posts;

        if (loggedUser.getId().equals(id)) {
            // É o próprio usuário: pode ver todos os posts e editar os seus (editable = true quando < 7 dias)
            posts = postService.getMyPosts(filter).stream().toList();
        } else {
            // Outro usuário visualizando: só vê posts públicos e não editáveis
            posts = postService.getUserPosts(id, filter).stream().toList();
        }

        return new CompanyProfileResponseDTO(
                user.getId(),
                user.getName(),
                user.getHandle(),
                user.getExternalLink(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getCity(),
                user.getUf(),
                followersCount,
                user.getProfilePic(),
                company.getCompanyType(),
                company.getDescription(),
                company.getAboutUs(),
                posts
        );
    }

    @Transactional
    public CompanyProfileResponseDTO updateMyProfile(CompanyProfileRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        User user = userRepository.findById(loggedUser.getId())
                .orElseThrow(UserNotFoundException::new);

        Company company = companyRepository.findById(user.getId())
                .orElseThrow(CompanyNotFoundException::new);

        user.setName(request.name());
        user.setPhoneNumber(request.phoneNumber());
        user.setEmail(request.email());
        user.setCep(request.cep());
        user.setNeighborhood(request.neighborhood());
        user.setStreet(request.street());
        user.setUf(request.uf());

        company.setCnpj(request.cnpj());
        company.setCompanyType(request.companyType());

        // description (até 400 caracteres)
        if (request.description() != null) {
            if (request.description().length() > 400) {
                throw new ValidationException("description deve ter no máximo 400 caracteres.");
            }
            company.setDescription(request.description());
        }

        // aboutUs (até 1000 caracteres)
        if (request.aboutUs() != null) {
            if (request.aboutUs().length() > 1000) {
                throw new ValidationException("aboutUs deve ter no máximo 1000 caracteres.");
            }
            company.setAboutUs(request.aboutUs());
        }

        // externalLink (até 100 caracteres e deve ser URL válida)
        if (request.externalLink() != null) {
            String link = getLink(request);
            user.setExternalLink(link);
        }

        userRepository.save(user);
        companyRepository.save(company);

        return getProfile(user.getId()); // retorna o perfil atualizado
    }

    public MyCompanyProfileResponseDTO getMyProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        Company loggedCompany = companyRepository.findById(loggedUser.getId())
                .orElseThrow(CompanyNotFoundException::new);

        return new MyCompanyProfileResponseDTO(
                loggedUser.getId(),
                loggedUser.getName(),
                loggedCompany.getCnpj(),
                loggedCompany.getCompanyType(),
                loggedUser.getPhoneNumber(),
                loggedUser.getEmail(),
                loggedUser.getCep(),
                loggedUser.getNeighborhood(),
                loggedUser.getCity(),
                loggedUser.getStreet(),
                loggedUser.getUf(),
                loggedCompany.getDescription(),
                loggedCompany.getAboutUs(),
                loggedUser.getExternalLink()
        );
    }

    private static String getLink(CompanyProfileRequestDTO request) {
        String link = request.externalLink();
        if (link.length() > 100) {
            throw new ValidationException("externalLink deve ter no máximo 100 caracteres.");
        }
        try {
            URI uri = new URI(link);
            if (uri.getScheme() == null ||
                    !(uri.getScheme().equalsIgnoreCase("http") || uri.getScheme().equalsIgnoreCase("https"))) {
                throw new ValidationException("externalLink deve começar com http ou https.");
            }
            URL _tmp = uri.toURL();
        } catch (URISyntaxException | MalformedURLException e) {
            throw new ValidationException("externalLink não é uma URL válida.");
        }
        return link;
    }
}