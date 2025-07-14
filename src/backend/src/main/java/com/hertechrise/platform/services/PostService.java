package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.MediaRequestDTO;
import com.hertechrise.platform.data.dto.request.PostRequestDTO;
import com.hertechrise.platform.data.dto.response.MediaResponseDTO;
import com.hertechrise.platform.data.dto.response.PostResponseDTO;
import com.hertechrise.platform.exception.InvalidFileTypeException;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.CommunityRepository;
import com.hertechrise.platform.repository.PostRepository;
import com.hertechrise.platform.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommunityRepository communityRepository;

    private final MediaService mediaService;


    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;

    public PostRequestDTO processPostData(String content, Long idCommunity, List<MultipartFile> mediaFiles) {
        List<MediaRequestDTO> media = mediaFiles != null
                ? mediaFiles.stream()
                .map(this::toMediaRequestDTO)
                .toList()
                : List.of();

        return new PostRequestDTO(content, idCommunity, media);
    }

    private MediaRequestDTO toMediaRequestDTO(MultipartFile file) {
        String mimeType = file.getContentType();
        if (mimeType == null || !mimeType.matches("^(image|video|application)/.+$")) {
            throw new InvalidFileTypeException("MIME inválido: " + mimeType);
        }

        MediaType mediaType = switch (mimeType) {
            case String mt when mt.startsWith("image/")       -> MediaType.IMAGEM;
            case String mt when mt.startsWith("video/")       -> MediaType.VIDEO;
            case String mt when mt.startsWith("application/") -> MediaType.DOCUMENTO;
            default -> throw new InvalidFileTypeException("Tipo não suportado: " + mimeType);
        };

        String url = cloudinaryService.uploadFile(file);
        return new MediaRequestDTO(mediaType, mimeType, url);
    }

    @Transactional
    public PostResponseDTO create(PostRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User author = (User) auth.getPrincipal();

        Community community = null;
        if (request.idCommunity() != null) {
            community = communityRepository.findById(request.idCommunity())
                    .orElseThrow(() -> new EntityNotFoundException("Comunidade não encontrada"));
        }

        Post post = new Post();
        post.setAuthor(author);
        post.setContent(request.content());
        post.setCommunity(community);
        post.setCreatedAt(LocalDateTime.now());

        if (request.media() != null && !request.media().isEmpty()) {
            List<Media> mediaList = mediaService.buildMediaEntities(post, request.media());
            post.setMedia(mediaList);
        }

        Post saved = postRepository.save(post);

        List<MediaResponseDTO> mediaDtos = saved.getMedia() == null
                ? List.of()
                : saved.getMedia().stream()
                .map(m -> new MediaResponseDTO(m.getId(), m.getMediaType(), m.getUrl()))
                .toList();

        return new PostResponseDTO(
                saved.getId(),
                saved.getAuthor().getId(),
                saved.getContent(),
                saved.getCreatedAt(),
                saved.getCommunity() != null ? saved.getCommunity().getId() : null,
                mediaDtos
        );
    }
}
