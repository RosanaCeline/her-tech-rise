package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.*;
import com.hertechrise.platform.data.dto.response.MediaResponseDTO;
import com.hertechrise.platform.data.dto.response.PostResponseDTO;
import com.hertechrise.platform.exception.InvalidFileTypeException;
import com.hertechrise.platform.exception.MaxMediaLimitExceededException;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.CommunityRepository;
import com.hertechrise.platform.repository.FollowRelationshipRepository;
import com.hertechrise.platform.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommunityRepository communityRepository;
    private final FollowRelationshipRepository followRelationshipRepository;

    private final MediaService mediaService;
    private final CloudinaryService cloudinaryService;

    public PostRequestDTO processPostData(String content, Long idCommunity, PostVisibility visibility, List<MultipartFile> mediaFiles) {
        List<MediaRequestDTO> media = mediaFiles != null
                ? mediaFiles.stream()
                .map(this::toMediaRequestDTO)
                .toList()
                : List.of();

        return new PostRequestDTO(content, idCommunity, visibility, media);
    }

    @Transactional
    private MediaRequestDTO toMediaRequestDTO(MultipartFile file) {
        String mimeType = file.getContentType();
        if (mimeType == null) {
            throw new InvalidFileTypeException("MIME nulo");
        }

        MediaType mediaType = switch (mimeType) {
            case String mt when mt.startsWith("image/")       -> MediaType.IMAGE;
            case String mt when mt.startsWith("video/")       -> MediaType.VIDEO;
            case String mt when mt.startsWith("application/") -> MediaType.DOCUMENT;
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
        post.setVisibility(request.visibility());

        if (request.media() != null && !request.media().isEmpty()) {
            if (request.media().size() > 10) {
                throw new MaxMediaLimitExceededException();
            }

            List<Media> mediaList = mediaService.buildMediaEntities(post, request.media());
            post.setMedia(mediaList);
        }

        post = postRepository.save(post);

        List<MediaResponseDTO> mediaDtos = post.getMedia() != null
                ? post.getMedia().stream()
                .map(m -> new MediaResponseDTO(m.getId(), m.getMediaType(), m.getUrl()))
                .toList()
                : List.of();

        return new PostResponseDTO(
                post.getId(),
                new PostResponseDTO.AuthorDTO(
                        post.getAuthor().getId(),
                        post.getAuthor().getName(),
                        post.getAuthor().getHandle(),
                        post.getAuthor().getProfilePic(),
                        false
                ),
                post.getContent(),
                post.getCreatedAt(),
                post.getCommunity() != null ? post.getCommunity().getId() : null,
                mediaDtos,
                post.getVisibility(),
                post.isEdited(),
                post.getEditedAt(),
                true,
                true
        );
    }

    @Transactional
    public void delete(Long postId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Postagem não encontrada."));

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("Você não tem permissão para excluir esta postagem.");
        }

        post.setDeleted(true);
        postRepository.save(post);
    }

    @Transactional
    public void updateVisibility(Long postId, PostVisibility newVisibility) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Postagem não encontrada."));

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("Você não tem permissão para alterar a visibilidade desta postagem.");
        }

        post.setVisibility(newVisibility);
        postRepository.save(post);
    }

    @Transactional
    public PostResponseDTO editPost(Long postId, PostEditRequestDTO request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Postagem não encontrada."));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("Você não tem permissão para editar esta postagem.");
        }

        if (post.getCreatedAt().isBefore(LocalDateTime.now().minusDays(7))) {
            throw new IllegalStateException("Você só pode editar postagens feitas nos últimos 7 dias.");
        }

        List<MediaEditRequestDTO> medias = request.medias() != null ? request.medias() : List.of();

        if (medias.size() > 10) {
            throw new MaxMediaLimitExceededException();
        }

        // Atualiza conteúdo e visibilidade
        post.setContent(request.content());
        post.setVisibility(request.visibility());

        // IDs das mídias antigas que o usuário quer manter
        List<Long> mediaIdsToKeep = medias.stream()
                .map(MediaEditRequestDTO::id)
                .filter(Objects::nonNull)
                .toList();

        // Remove mídias antigas que não estão na lista de manutenção
        post.getMedia().removeIf(m -> !mediaIdsToKeep.contains(m.getId()));

        // Upload mídias novas e adiciona
        List<Media> novasMedias = medias.stream()
                .filter(m -> m.id() == null && m.file() != null)
                .map(m -> {
                    // Validação simples de mimeType e mediaType
                    String mimeType = m.mimeType();
                    if (mimeType == null || !mimeType.matches("^(image|video|application)/.+$")) {
                        throw new IllegalArgumentException("MIME inválido para arquivo: " + mimeType);
                    }

                    String url = cloudinaryService.uploadFile(m.file());
                    Media media = new Media();
                    media.setPost(post);
                    media.setMediaType(m.mediaType());
                    media.setMimeType(mimeType);
                    media.setUrl(url);
                    return media;
                })
                .toList();

        post.getMedia().addAll(novasMedias);

        // Marca como editado
        post.setEdited(true);
        post.setEditedAt(LocalDateTime.now());

        Post saved = postRepository.save(post);

        // Retorna DTO atualizado
        List<MediaResponseDTO> mediaDtos = saved.getMedia() == null
                ? List.of()
                : saved.getMedia().stream()
                .map(m -> new MediaResponseDTO(m.getId(), m.getMediaType(), m.getUrl()))
                .toList();

        boolean editable = post.getCreatedAt().isAfter(LocalDateTime.now().minusDays(7));

        return new PostResponseDTO(
                saved.getId(),
                new PostResponseDTO.AuthorDTO(
                        post.getAuthor().getId(),
                        post.getAuthor().getName(),
                        post.getAuthor().getHandle(),
                        post.getAuthor().getProfilePic(),
                        false
                ),
                saved.getContent(),
                saved.getCreatedAt(),
                saved.getCommunity() != null ? saved.getCommunity().getId() : null,
                mediaDtos,
                saved.getVisibility(),
                saved.isEdited(),
                saved.getEditedAt(),
                true,
                editable
        );
    }

    @Transactional(readOnly = true)
    public Page<PostResponseDTO> getMyPosts(PostFilterRequestDTO filter) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        Pageable pageable = PageRequest.of(
                filter.page(),
                filter.size(),
                Sort.by(Sort.Direction.fromString(filter.direction()), filter.orderBy())
        );

        Specification<Post> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("author").get("id"), loggedUser.getId()));
            predicates.add(cb.isFalse(root.get("deleted")));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Post> posts = postRepository.findAll(spec, pageable);

        return posts.map(post -> {
            boolean editable = post.getCreatedAt().isAfter(LocalDateTime.now().minusDays(7));

            List<MediaResponseDTO> mediaDtos = post.getMedia() == null
                    ? List.of()
                    : post.getMedia().stream()
                    .map(m -> new MediaResponseDTO(m.getId(), m.getMediaType(), m.getUrl()))
                    .toList();

            return new PostResponseDTO(
                    post.getId(),
                    new PostResponseDTO.AuthorDTO(
                            post.getAuthor().getId(),
                            post.getAuthor().getName(),
                            post.getAuthor().getHandle(),
                            post.getAuthor().getProfilePic(),
                            false
                    ),
                    post.getContent(),
                    post.getCreatedAt(),
                    post.getCommunity() != null ? post.getCommunity().getId() : null,
                    mediaDtos,
                    post.getVisibility(),
                    post.isEdited(),
                    post.getEditedAt(),
                    true,
                    editable // Aqui o campo que indica se pode editar
            );
        });
    }

    @Transactional(readOnly = true)
    public Page<PostResponseDTO> getUserPosts(Long userId, PostFilterRequestDTO filter) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        Pageable pageable = PageRequest.of(
                filter.page(),
                filter.size(),
                Sort.by(Sort.Direction.fromString(filter.direction()), filter.orderBy())
        );

        Specification<Post> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("author").get("id"), userId));
            predicates.add(cb.equal(root.get("visibility"), PostVisibility.PUBLICO)); // Só públicos
            predicates.add(cb.isFalse(root.get("deleted")));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Post> posts = postRepository.findAll(spec, pageable);

        return posts.map(post -> {
            List<MediaResponseDTO> mediaDtos = post.getMedia() == null
                    ? List.of()
                    : post.getMedia().stream()
                    .map(m -> new MediaResponseDTO(m.getId(), m.getMediaType(), m.getUrl()))
                    .toList();

            User author = post.getAuthor();
            boolean isFollowed = followRelationshipRepository.existsByFollowerAndFollowing(loggedUser, author);

            return new PostResponseDTO(
                    post.getId(),
                    new PostResponseDTO.AuthorDTO(
                            post.getAuthor().getId(),
                            post.getAuthor().getName(),
                            post.getAuthor().getHandle(),
                            post.getAuthor().getProfilePic(),
                            isFollowed
                    ),
                    post.getContent(),
                    post.getCreatedAt(),
                    post.getCommunity() != null ? post.getCommunity().getId() : null,
                    mediaDtos,
                    post.getVisibility(),
                    post.isEdited(),
                    post.getEditedAt(),
                    false,
                    false // posts de outros usuários não são editáveis
            );
        });
    }

    @Transactional(readOnly = true)
    public Page<PostResponseDTO> getTimelinePosts(PostFilterRequestDTO filter) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        Pageable pageable = PageRequest.of(
                filter.page(),
                filter.size(),
                Sort.by(Sort.Direction.fromString(filter.direction()), filter.orderBy())
        );

        Specification<Post> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isFalse(root.get("deleted")));

            predicates.add(cb.or(
                    cb.equal(root.get("visibility"), PostVisibility.PUBLICO),   // posts públicos
                    cb.equal(root.get("author").get("id"), loggedUser.getId())  // posts do próprio usuário (podem ser privados)
            ));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Post> posts = postRepository.findAll(spec, pageable);

        return posts.map(post -> {
            User author = post.getAuthor();
            boolean isFollowed = followRelationshipRepository.existsByFollowerAndFollowing(loggedUser, author);
            return PostResponseDTO.from(post, loggedUser.getId(), isFollowed);
        });
    }
}

