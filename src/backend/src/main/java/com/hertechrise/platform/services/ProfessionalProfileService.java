package com.hertechrise.platform.services;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hertechrise.platform.data.dto.request.ExperienceRequestDTO;
import com.hertechrise.platform.data.dto.request.ProfessionalProfileRequestDTO;
import com.hertechrise.platform.data.dto.response.ExperienceResponseDTO;
import com.hertechrise.platform.data.dto.response.ExperienceTitleResponseDTO;
import com.hertechrise.platform.data.dto.response.MediaResponseDTO;
import com.hertechrise.platform.data.dto.response.MyProfessionalProfileResponseDTO;
import com.hertechrise.platform.data.dto.response.PostResponseDTO;
import com.hertechrise.platform.data.dto.response.ProfessionalProfileResponseDTO;
import com.hertechrise.platform.exception.ProfessionalNotFoundException;
import com.hertechrise.platform.exception.UserNotFoundException;
import com.hertechrise.platform.model.Experience;
import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.Professional;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.repository.FollowRelationshipRepository;
import com.hertechrise.platform.repository.PostRepository;
import com.hertechrise.platform.repository.ProfessionalRepository;
import com.hertechrise.platform.repository.UserRepository;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfessionalProfileService {

    private final UserRepository userRepository;
    private final ProfessionalRepository professionalRepository;
    private final FollowRelationshipRepository followRepository;
    private final PostRepository postRepository;

    private final ExperienceService experienceService;

    @Transactional
    public ProfessionalProfileResponseDTO getProfile(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        User user = userRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        Professional professional = professionalRepository.findById(id)
                .orElseThrow(ProfessionalNotFoundException::new);

        long followersCount = followRepository.countByFollowing(user);

        List<PostResponseDTO> posts = postRepository
                .findByAuthorOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toPostDto)
                .toList();

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

        professional.setCpf(request.cpf());
        professional.setBirthDate(request.birthDate());

        // technology (até 80 caracteres)
        if (request.technology() != null) {
            if (request.technology().length() > 80) {
                throw new ValidationException("technology deve ter no máximo 80 caracteres.");
            }
            professional.setTechnology(request.technology());
        }

        // biography (até 1000 caracteres)
        if (request.biography() != null) {
            if (request.biography().length() > 1000) {
                throw new ValidationException("biography deve ter no máximo 1000 caracteres.");
            }
            professional.setBiography(request.biography());
        }

        if (request.experiences() != null) {
            if (request.experiences().size() > 20) {
                // Exemplo: limite arbitrário de 20 experiências
                throw new ValidationException("Máximo de 20 experiências permitidas.");
            }
            experienceService.syncExperiences(professional, request.experiences());
        }

        // externalLink (até 100 caracteres e deve ser URL válida)
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

        return getProfile(user.getId()); // retorna o perfil atualizado
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
                loggedProfessional.getBirthDate(),
                loggedUser.getPhoneNumber(),
                loggedUser.getEmail(),
                loggedUser.getCep(),
                loggedUser.getNeighborhood(),
                loggedUser.getCity(),
                loggedUser.getStreet(),
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

    private PostResponseDTO toPostDto(Post p) {
        List<MediaResponseDTO> medias = p.getMedia().stream()
                .map(m -> new MediaResponseDTO(
                        m.getId(),
                        m.getMediaType(),
                        m.getUrl()
                )).toList();

        return new PostResponseDTO(
                p.getId(),
                p.getAuthor().getId(),
                p.getContent(),
                p.getCreatedAt(),
//                p.getCommunity().getId(),
                p.getCommunity() != null ? p.getCommunity().getId() : null,
                medias
        );
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
