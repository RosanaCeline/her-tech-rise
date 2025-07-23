package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.*;
import com.hertechrise.platform.data.dto.response.MediaResponseDTO;
import com.hertechrise.platform.data.dto.response.PostResponseDTO;
import com.hertechrise.platform.exception.InvalidFileTypeException;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.CommunityRepository;
import com.hertechrise.platform.repository.MediaRepository;
import com.hertechrise.platform.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
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
    private final MediaRepository mediaRepository;

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

    private MediaRequestDTO toMediaRequestDTO(MultipartFile file) {
        String mimeType = file.getContentType();
        if (mimeType == null || !mimeType.matches("^(image|video|application)/.+$")) {
            throw new InvalidFileTypeException("MIME inválido: " + mimeType);
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
                post.getAuthor().getId(),
                post.getContent(),
                post.getCreatedAt(),
                post.getCommunity() != null ? post.getCommunity().getId() : null,
                mediaDtos,
                post.getVisibility(),
                post.isEdited(),
                post.getEditedAt()
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
            throw new IllegalArgumentException("Máximo de 10 mídias por postagem.");
        }

        // Atualiza conteúdo e visibilidade
        post.setContent(request.content());
        post.setVisibility(request.visibility());

        // IDs das mídias antigas que o usuário quer manter
        List<Long> mediaIdsToKeep = medias.stream()
                .map(MediaEditRequestDTO::id)
                .filter(id -> id != null)
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

        return new PostResponseDTO(
                saved.getId(),
                saved.getAuthor().getId(),
                saved.getContent(),
                saved.getCreatedAt(),
                saved.getCommunity() != null ? saved.getCommunity().getId() : null,
                mediaDtos,
                saved.getVisibility(),
                saved.isEdited(),
                saved.getEditedAt()
        );
    }

     /*
    public Page<PostResponseDTO> getPostsByUser(Long userId, PostFilterRequestDTO filter, Long authenticatedUserId) {

        // Configura ordenação (padrão: createdAt DESC)
        Pageable pageable = PageRequest.of(
                filter.page(),
                filter.size(),
                Sort.by(Sort.Direction.fromString(filter.direction()), filter.orderBy())
        );

        // Define critérios dinâmicos de busca (Specification)
        Specification<Post> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Apenas posts do autor solicitado
            predicates.add(cb.equal(root.get("author").get("id"), userId));

            // Ignora posts deletados
            predicates.add(cb.isFalse(root.get("deleted")));

            // Filtro por status (opcional)
            if (filter.status() != null) {
                switch (filter.status().toLowerCase()) {
                    case "publico" -> predicates.add(cb.equal(root.get("visibility"), PostVisibility.PUBLICO));
                    case "privado" -> predicates.add(cb.equal(root.get("visibility"), PostVisibility.PRIVADO));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Consulta paginada ao banco
        Page<Post> page = postRepository.findAll(spec, pageable);

        // Mapeia cada entidade Post para um DTO de resposta
        return page.map(post -> {
            // Busca as mídias relacionadas a este post
            List<MediaResponseDTO> media = mediaRepository.findByPostId(post.getId())
                    .stream()
                    .map(mediaEntity -> new MediaResponseDTO(
                            mediaEntity.getId(),
                            mediaEntity.getMediaType(),
                            mediaEntity.getUrl()
                    ))
                    .toList();

            // Constrói o DTO de resposta
            return new PostResponseDTO(
                    post.getId(),
                    post.getAuthor().getId(),
                    post.getContent(),
                    post.getCreatedAt(),
                    post.getCommunity() != null ? post.getCommunity().getId() : null,
                    media,
                    PostVisibility.valueOf(post.getVisibility().name()),
                    post.isEdited(),
                    post.getEditedAt()
            );
        });
    }
      */
}

