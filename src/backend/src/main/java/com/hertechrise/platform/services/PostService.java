package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.*;
import com.hertechrise.platform.data.dto.response.*;
import com.hertechrise.platform.exception.InvalidFileTypeException;
import com.hertechrise.platform.exception.MaxMediaLimitExceededException;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.CommunityRepository;
import com.hertechrise.platform.repository.PostRepository;
import com.hertechrise.platform.repository.PostShareRepository;
import com.hertechrise.platform.repository.TimelineRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLConnection;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostShareRepository postShareRepository;
    private final CommunityRepository communityRepository;
    private final TimelineRepository timelineRepository;

    private final MediaService mediaService;
    private final CloudinaryService cloudinaryService;
    private final PostInteractionService postInteractionService;
    private final PostFeedAssembler postFeedAssembler;

    public PostRequestDTO processPostData(String content, Long idCommunity, PostVisibility visibility, List<MultipartFile> mediaFiles) {
        if ((content == null || content.trim().isEmpty()) && (mediaFiles == null || mediaFiles.isEmpty())) {
            throw new ValidationException("Informe o conteúdo ou adicione uma mídia.");
        }

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
                AuthorResponseDTO.from(post.getAuthor(), false),
                post.getContent(),
                post.getCreatedAt(),
                post.getCommunity() != null ? post.getCommunity().getId() : null,
                mediaDtos,
                post.getVisibility(),
                post.isEdited(),
                post.getEditedAt(),
                true,
                true,
                0L,
                0L,
                0L
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
    public PostResponseDTO editPost(Long postId, PostEditRequestDTO request, List<MultipartFile> newFiles) {
        if ((request.content() == null || request.content().trim().isEmpty()) && (request.medias() == null ||
                request.medias().isEmpty()) && (newFiles == null || newFiles.isEmpty())) {
            throw new ValidationException("Informe o conteúdo ou adicione uma mídia.");
        }

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

        List<MultipartFile> arquivosNovos = (newFiles != null)
                ? newFiles.stream().filter(f -> f != null && !f.isEmpty()).toList()
                : List.of();

        int totalMidias = medias.size() + arquivosNovos.size();
        if (totalMidias > 10) {
            throw new MaxMediaLimitExceededException();
        }

        post.setContent(request.content());
        post.setVisibility(request.visibility());

        List<Long> mediaIdsToKeep = medias.stream()
                .map(MediaEditRequestDTO::id)
                .filter(Objects::nonNull)
                .toList();

        post.getMedia().removeIf(m -> !mediaIdsToKeep.contains(m.getId()));

        List<Media> novasDoDTO = medias.stream()
                .filter(m -> m.id() == null && m.url() != null)
                .map(m -> {
                    String mimeType = URLConnection.guessContentTypeFromName(m.url());

                    Media media = new Media();
                    media.setPost(post);
                    media.setMediaType(m.mediaType());
                    media.setMimeType(mimeType);
                    media.setUrl(m.url());
                    return media;
                })
                .toList();

        List<Media> novasDosArquivos = arquivosNovos.isEmpty() ? List.of() : arquivosNovos.stream()
                .map(file -> {
                    String mimeType = file.getContentType();
                    if (mimeType == null || !mimeType.matches("^(image|application)/.+$")) {
                        throw new IllegalArgumentException("MIME inválido para arquivo: " + mimeType);
                    }

                    MediaType mediaType = switch (mimeType) {
                        case String mt when mt.startsWith("image/")       -> MediaType.IMAGE;
                        case String mt when mt.startsWith("application/") -> MediaType.DOCUMENT;
                        default -> throw new IllegalArgumentException("Tipo não suportado: " + mimeType);
                    };

                    String url = cloudinaryService.uploadFile(file);

                    Media media = new Media();
                    media.setPost(post);
                    media.setMediaType(mediaType);
                    media.setMimeType(mimeType);
                    media.setUrl(url);
                    return media;
                })
                .toList();

        post.getMedia().addAll(novasDoDTO);
        post.getMedia().addAll(novasDosArquivos);

        post.setEdited(true);
        post.setEditedAt(LocalDateTime.now());

        Post saved = postRepository.save(post);

        List<MediaResponseDTO> mediaDtos = saved.getMedia() == null
                ? List.of()
                : saved.getMedia().stream()
                .map(m -> new MediaResponseDTO(m.getId(), m.getMediaType(), m.getUrl()))
                .toList();

        boolean editable = post.getCreatedAt().isAfter(LocalDateTime.now().minusDays(7));

        return new PostResponseDTO(
                saved.getId(),
                AuthorResponseDTO.from(post.getAuthor(), false),
                saved.getContent(),
                saved.getCreatedAt(),
                saved.getCommunity() != null ? saved.getCommunity().getId() : null,
                mediaDtos,
                saved.getVisibility(),
                saved.isEdited(),
                saved.getEditedAt(),
                true,
                editable,
                postInteractionService.countLikes(post.getId()),
                postInteractionService.countComments(post.getId()),
                postInteractionService.countShares(post.getId())
        );
    }

    @Transactional(readOnly = true)
    public Page<UnifiedPostResponseDTO> getMyPosts(PostFilterRequestDTO filter) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        Sort sort = Sort.by(Sort.Direction.fromString(filter.direction()), filter.orderBy());

        List<Post> posts = postRepository.findAllByAuthorIdAndDeletedFalse(loggedUser.getId());
        List<PostShare> shares = postShareRepository.findAllByUserId(loggedUser.getId());

        List<UnifiedPostResponseDTO> combined = new ArrayList<>(postFeedAssembler.assemble(posts, shares, loggedUser, false));
        combined.sort(Comparator.comparing(UnifiedPostResponseDTO::createdAt).reversed());

        return paginate(combined, PageRequest.of(filter.page(), filter.size(), sort));
    }

    @Transactional(readOnly = true)
    public Page<UnifiedPostResponseDTO> getUserPosts(Long userId, PostFilterRequestDTO filter) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();
        boolean isOwnProfile = userId.equals(loggedUser.getId());

        Specification<Post> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("author").get("id"), userId));
            predicates.add(cb.isFalse(root.get("deleted")));

            if (!isOwnProfile) {
                predicates.add(cb.equal(root.get("visibility"), PostVisibility.PUBLICO));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Post> posts = postRepository.findAll(spec);

        // Compartilhamentos: pegar todos os compartilhamentos do usuário
        List<PostShare> shares = postShareRepository.findAllSharesByUserId(userId).stream()
                .filter(share -> {
                    Post post = share.getPost();
                    if (post.isDeleted()) return false;
                    return isOwnProfile || post.getVisibility() == PostVisibility.PUBLICO;
                })
                .toList();

        List<UnifiedPostResponseDTO> allItems = new ArrayList<>(postFeedAssembler.assemble(posts, shares, loggedUser, !isOwnProfile));
        allItems.sort(byCreatedAt(filter.direction()));

        return paginate(allItems, PageRequest.of(filter.page(), filter.size()));
    }

    /**
     * Timeline: somente postagens públicas e compartilhamentos de postagens públicas.
     * A paginação acontece no banco e os dados da página são carregados em lote.
     */
    @Transactional(readOnly = true)
    public Page<UnifiedPostResponseDTO> getTimelinePosts(PostFilterRequestDTO filter) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        Pageable pageable = PageRequest.of(filter.page(), filter.size());
        Page<TimelineRepository.TimelineItemRef> refs = timelineRepository.findPublicItems(
                pageable, filter.direction().equalsIgnoreCase("ASC"));

        if (refs.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, refs.getTotalElements());
        }

        List<Long> postIds = idsOf(refs.getContent(), PostContentType.POSTAGEM);
        List<Long> shareIds = idsOf(refs.getContent(), PostContentType.COMPARTILHAMENTO);

        List<Post> posts = postIds.isEmpty() ? List.of() : postRepository.findAllWithAuthorAndMediaByIdIn(postIds);
        List<PostShare> shares = shareIds.isEmpty() ? List.of() : postShareRepository.findAllWithUserByIdIn(shareIds);

        Map<String, UnifiedPostResponseDTO> itemsByKey = new HashMap<>();
        for (UnifiedPostResponseDTO item : postFeedAssembler.assemble(posts, shares, loggedUser, true)) {
            itemsByKey.put(keyOf(item), item);
        }

        // mantém a ordem definida pela consulta paginada
        List<UnifiedPostResponseDTO> content = refs.getContent().stream()
                .map(ref -> itemsByKey.get(ref.type() + ":" + ref.id()))
                .filter(Objects::nonNull)
                .toList();

        return new PageImpl<>(content, pageable, refs.getTotalElements());
    }

    private static List<Long> idsOf(List<TimelineRepository.TimelineItemRef> refs, PostContentType type) {
        return refs.stream().filter(ref -> ref.type() == type).map(TimelineRepository.TimelineItemRef::id).toList();
    }

    private static String keyOf(UnifiedPostResponseDTO item) {
        return item.type() == PostContentType.POSTAGEM
                ? item.type() + ":" + item.post().id()
                : item.type() + ":" + item.share().sharedId();
    }

    private static Comparator<UnifiedPostResponseDTO> byCreatedAt(String direction) {
        Comparator<UnifiedPostResponseDTO> comparator = Comparator.comparing(UnifiedPostResponseDTO::createdAt);
        return direction.equalsIgnoreCase("DESC") ? comparator.reversed() : comparator;
    }

    private static Page<UnifiedPostResponseDTO> paginate(List<UnifiedPostResponseDTO> items, Pageable pageable) {
        int start = (int) Math.min(pageable.getOffset(), items.size());
        int end = Math.min(start + pageable.getPageSize(), items.size());
        return new PageImpl<>(items.subList(start, end), pageable, items.size());
    }

}

