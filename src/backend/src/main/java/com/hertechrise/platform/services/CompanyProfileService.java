package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.response.CompanyProfileResponseDTO;
import com.hertechrise.platform.data.dto.response.MediaResponseDTO;
import com.hertechrise.platform.data.dto.response.PostResponseDTO;
import com.hertechrise.platform.exception.CompanyNotFoundException;
import com.hertechrise.platform.exception.UserNotFoundException;
import com.hertechrise.platform.model.Company;
import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.repository.CompanyRepository;
import com.hertechrise.platform.repository.FollowRelationshipRepository;
import com.hertechrise.platform.repository.PostRepository;
import com.hertechrise.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyProfileService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final FollowRelationshipRepository followRepository;
    private final PostRepository postRepository;

    public CompanyProfileResponseDTO getProfile(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        User user = userRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        Company company = companyRepository.findById(id)
                .orElseThrow(CompanyNotFoundException::new);

        long followersCount = followRepository.countByFollowing(user);

        List<PostResponseDTO> posts = postRepository
                .findByAuthorOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toPostDto)
                .toList();

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
                p.getCommunity().getId(),
                medias
        );
    }
}