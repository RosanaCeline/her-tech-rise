package com.hertechrise.platform.services;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Comparator;
import java.util.List;

import com.hertechrise.platform.data.dto.request.PostFilterRequestDTO;
import com.hertechrise.platform.data.dto.response.*;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hertechrise.platform.data.dto.request.ExperienceRequestDTO;
import com.hertechrise.platform.data.dto.request.ProfessionalProfileRequestDTO;
import com.hertechrise.platform.exception.ProfessionalNotFoundException;
import com.hertechrise.platform.exception.UserNotFoundException;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfessionalProfileService {

    private final UserRepository userRepository;
    private final ProfessionalRepository professionalRepository;
    private final FollowRelationshipRepository followRepository;
    private final PostShareRepository postShareRepository;

    private final ExperienceService experienceService;
    private final PostService postService;

    @Transactional
    public ProfessionalProfileResponseDTO getProfile(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        User user = userRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        Professional professional = professionalRepository.findById(id)
                .orElseThrow(ProfessionalNotFoundException::new);

        long followersCount = followRepository.countByFollowing(user);

        PostFilterRequestDTO filter = new PostFilterRequestDTO(null, null, null, null);

        List<UnifiedPostResponseDTO> posts;

        if (loggedUser.getId().equals(id)) {
            posts = postService.getMyPosts(filter).stream().toList();
        } else {
            posts = postService.getUserPosts(id, filter).stream().toList();
        }

        List<ExperienceResponseDTO> experiences = professional.getExperiences().stream()
                .sorted(Comparator.comparing(Experience::getStartDate).reversed())
                .map(this::toExperienceDto)
                .toList();

        return new ProfessionalProfileResponseDTO(
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
                professional.getTechnology(),
                professional.getBiography(),
                experiences,
                posts
        );
    }

    @Transactional
    public ProfessionalProfileResponseDTO updateMyProfile(ProfessionalProfileRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        User user = userRepository.findById(loggedUser.getId())
                .orElseThrow(UserNotFoundException::new);

        Professional professional = professionalRepository.findById(user.getId())
                .orElseThrow(ProfessionalNotFoundException::new);

        user.setName(request.name());
        user.setPhoneNumber(request.phoneNumber());
        user.setEmail(request.email());
        user.setCep(request.cep());
        user.setNeighborhood(request.neighborhood());
        user.setStreet(request.street());
        user.setUf(request.uf());

        professional.setCpf(request.cpf());
        professional.setGender(request.gender());
        professional.setConsentGenderSharing(request.consentGenderSharing());
        professional.setBirthDate(request.birthDate());

        if (request.technology() != null) {
            if (request.technology().length() > 80) {
                throw new ValidationException("technology deve ter no máximo 80 caracteres.");
            }
            professional.setTechnology(request.technology());
        }

        if (request.biography() != null) {
            if (request.biography().length() > 1000) {
                throw new ValidationException("biography deve ter no máximo 1000 caracteres.");
            }
            professional.setBiography(request.biography());
        }

        if (request.experiences() != null && request.experiences().size() > 20) {
            throw new ValidationException("Máximo de 20 experiências permitidas.");
        }

        if (request.externalLink() != null) {
            String link = getLink(request);
            user.setExternalLink(link);
        }

        List<ExperienceRequestDTO> incoming =
                request.experiences() == null ? List.of() : request.experiences();

        if (incoming.size() > 20)
            throw new ValidationException("Máximo de 20 experiências permitidas.");

        experienceService.syncExperiences(professional, incoming);

        userRepository.save(user);
        professionalRepository.save(professional);

        return getProfile(user.getId());
    }

    @Transactional
    public MyProfessionalProfileResponseDTO getMyProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        Professional loggedProfessional = professionalRepository.findById(loggedUser.getId())
                .orElseThrow(ProfessionalNotFoundException::new);


        List<ExperienceResponseDTO> experiences = loggedProfessional.getExperiences().stream()
                .sorted(Comparator.comparing(Experience::getStartDate).reversed())
                .map(this::toExperienceDto)
                .toList();

        return new MyProfessionalProfileResponseDTO(
                loggedUser.getId(),
                loggedUser.getName(),
                loggedProfessional.getCpf(),
                loggedProfessional.getGender(),
                loggedProfessional.getConsentGenderSharing(),
                loggedProfessional.getBirthDate(),
                loggedUser.getPhoneNumber(),
                loggedUser.getEmail(),
                loggedUser.getCep(),
                loggedUser.getNeighborhood(),
                loggedUser.getCity(),
                loggedUser.getStreet(),
                loggedUser.getUf(),
                loggedProfessional.getTechnology(),
                loggedProfessional.getBiography(),
                experiences,
                loggedUser.getExternalLink()
        );
    }

    private static String getLink(ProfessionalProfileRequestDTO request) {
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

    private ExperienceResponseDTO toExperienceDto(Experience e) {
        return new ExperienceResponseDTO(
                e.getId(),
                e.getTitle(),
                e.getCompany(),
                e.getModality(),
                e.getStartDate(),
                e.getEndDate(),
                e.isCurrent(),
                e.getDescription()
        );
    }
}
