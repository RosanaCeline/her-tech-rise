package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.*;
import com.hertechrise.platform.data.dto.response.*;
import com.hertechrise.platform.exception.InvalidFileTypeException;
import com.hertechrise.platform.exception.MaxMediaLimitExceededException;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.CommunityRepository;
import com.hertechrise.platform.repository.FollowRelationshipRepository;
import com.hertechrise.platform.repository.PostRepository;
import com.hertechrise.platform.repository.PostShareRepository;
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
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostShareRepository postShareRepository;
    private final CommunityRepository communityRepository;
    private final FollowRelationshipRepository followRelationshipRepository;

    private final MediaService mediaService;
    private final CloudinaryService cloudinaryService;
    private final PostInteractionService postInteractionService;

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
                new AuthorResponseDTO(
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
                true,
                postInteractionService.countLikes(post.getId()),
                postInteractionService.countComments(post.getId()),
                postInteractionService.countShares(post.getId())
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
                    if (mimeType == null || !mimeType.matches("^(image|video|application)/.+$")) {
                        throw new IllegalArgumentException("MIME inválido para arquivo: " + mimeType);
                    }

                    MediaType mediaType = switch (mimeType) {
                        case String mt when mt.startsWith("image/")       -> MediaType.IMAGE;
                        case String mt when mt.startsWith("video/")       -> MediaType.VIDEO;
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
                new AuthorResponseDTO(
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

        List<UnifiedPostResponseDTO> postDTOs = posts.stream().map(post -> {
            boolean isFollowed = followRelationshipRepository.existsByFollowerAndFollowing(loggedUser, post.getAuthor());
            return new UnifiedPostResponseDTO(
                    PostContentType.POSTAGEM,
                    PostResponseDTO.from(
                            post,
                            loggedUser.getId(),
                            isFollowed,
                            postInteractionService.countLikes(post.getId()),
                            postInteractionService.countComments(post.getId()),
                            postInteractionService.countShares(post.getId())
                    ),
                    null,
                    post.getCreatedAt()
            );
        }).toList();

        List<UnifiedPostResponseDTO> shareDTOs = shares.stream().map(share -> {
            boolean isFollowed = followRelationshipRepository.existsByFollowerAndFollowing(loggedUser, share.getPost().getAuthor());
            boolean isFollowedSharer = followRelationshipRepository.existsByFollowerAndFollowing(loggedUser, share.getUser());
            return new UnifiedPostResponseDTO(
                    PostContentType.COMPARTILHAMENTO,
                    null,
                    SharedPostResponseDTO.from(
                            share,
                            loggedUser.getId(),
                            isFollowed,
                            null,
                            postInteractionService.countShareLikes(share.getId()),
                            postInteractionService.countShareComments(share.getId())
                    ),
                    share.getCreatedAt()
            );
        }).toList();

        List<UnifiedPostResponseDTO> combined = Stream.concat(postDTOs.stream(), shareDTOs.stream())
                .sorted(Comparator.comparing(UnifiedPostResponseDTO::createdAt).reversed())
                .toList();

        int start = filter.page() * filter.size();
        int end = Math.min(start + filter.size(), combined.size());
        List<UnifiedPostResponseDTO> pageContent = start < end ? combined.subList(start, end) : List.of();

        return new PageImpl<>(pageContent, PageRequest.of(filter.page(), filter.size(), sort), combined.size());
    }

    @Transactional(readOnly = true)
    public Page<UnifiedPostResponseDTO> getUserPosts(Long userId, PostFilterRequestDTO filter) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        Comparator<UnifiedPostResponseDTO> comparator = Comparator
                .comparing(UnifiedPostResponseDTO::createdAt);

        if (filter.direction().equalsIgnoreCase("DESC")) {
            comparator = comparator.reversed();
        }

        Specification<Post> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("author").get("id"), userId));
            predicates.add(cb.isFalse(root.get("deleted")));

            if (!userId.equals(loggedUser.getId())) {
                predicates.add(cb.equal(root.get("visibility"), PostVisibility.PUBLICO));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Post> posts = postRepository.findAll(spec);

        List<UnifiedPostResponseDTO> postItems = posts.stream().map(post -> {
            boolean isFollowed = followRelationshipRepository.existsByFollowerAndFollowing(loggedUser, post.getAuthor());
            return new UnifiedPostResponseDTO(
                    PostContentType.POSTAGEM,
                    PostResponseDTO.from(
                            post,
                            loggedUser.getId(),
                            isFollowed,
                            postInteractionService.countLikes(post.getId()),
                            postInteractionService.countComments(post.getId()),
                            postInteractionService.countShares(post.getId())
                    ),
                    null,
                    post.getCreatedAt()
            );
        }).toList();

        // Compartilhamentos: pegar todos os compartilhamentos do usuário
        List<PostShare> shares = postShareRepository.findAllSharesByUserId(userId);
        List<UnifiedPostResponseDTO> shareItems = shares.stream()
                .filter(share -> {
                    Post post = share.getPost();
                    if (post.isDeleted()) return false;

                    if (userId.equals(loggedUser.getId())) {
                        return true;
                    } else {
                        return post.getVisibility() == PostVisibility.PUBLICO;
                    }
                })
                .map(share -> {
                    Post post = share.getPost();
                    boolean isFollowed = followRelationshipRepository.existsByFollowerAndFollowing(loggedUser, post.getAuthor());
                    Boolean isFollowedSharer = userId.equals(loggedUser.getId()) ? null :
                            followRelationshipRepository.existsByFollowerAndFollowing(loggedUser, share.getUser());
                    return new UnifiedPostResponseDTO(
                            PostContentType.COMPARTILHAMENTO,
                            null,
                            SharedPostResponseDTO.from(
                                    share,
                                    loggedUser.getId(),
                                    isFollowed,
                                    isFollowedSharer,
                                    postInteractionService.countShareLikes(share.getId()),
                                    postInteractionService.countShareComments(share.getId())
                            ),
                            share.getCreatedAt()
                    );
                }).toList();

        List<UnifiedPostResponseDTO> allItems = new ArrayList<>();
        allItems.addAll(postItems);
        allItems.addAll(shareItems);
        allItems.sort(comparator);

        int start = filter.page() * filter.size();
        int end = Math.min(start + filter.size(), allItems.size());

        List<UnifiedPostResponseDTO> pagedItems = start > allItems.size()
                ? List.of()
                : allItems.subList(start, end);

        return new PageImpl<>(pagedItems, PageRequest.of(filter.page(), filter.size()), allItems.size());
    }

    @Transactional(readOnly = true)
    public Page<UnifiedPostResponseDTO> getTimelinePosts(PostFilterRequestDTO filter) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        Comparator<UnifiedPostResponseDTO> comparator = Comparator
                .comparing(UnifiedPostResponseDTO::createdAt);

        if (filter.direction().equalsIgnoreCase("DESC")) {
            comparator = comparator.reversed();
        }

        Specification<Post> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isFalse(root.get("deleted")));
            predicates.add(cb.or(
                    cb.equal(root.get("visibility"), PostVisibility.PUBLICO),
                    cb.equal(root.get("author").get("id"), loggedUser.getId())
            ));
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Post> posts = postRepository.findAll(spec);
        List<UnifiedPostResponseDTO> postItems = posts.stream().map(post -> {
            boolean isFollowed = followRelationshipRepository.existsByFollowerAndFollowing(loggedUser, post.getAuthor());
            return new UnifiedPostResponseDTO(
                    PostContentType.POSTAGEM,
                    PostResponseDTO.from(
                            post,
                            loggedUser.getId(),
                            isFollowed,
                            postInteractionService.countLikes(post.getId()),
                            postInteractionService.countComments(post.getId()),
                            postInteractionService.countShares(post.getId())
                    ),
                    null,
                    post.getCreatedAt()
            );
        }).toList();

        List<PostShare> shares = postShareRepository.findSharesForTimeline(loggedUser.getId());
        List<UnifiedPostResponseDTO> shareItems = shares.stream()
                .filter(share -> {
                    Post post = share.getPost();
                    return !post.isDeleted() &&
                            (post.getVisibility() == PostVisibility.PUBLICO || post.getAuthor().getId().equals(loggedUser.getId()));
                })
                .map(share -> {
                    Post post = share.getPost();
                    boolean isFollowed = followRelationshipRepository.existsByFollowerAndFollowing(loggedUser, post.getAuthor());
                    boolean isFollowedSharer = followRelationshipRepository.existsByFollowerAndFollowing(loggedUser, share.getUser());
                    return new UnifiedPostResponseDTO(
                            PostContentType.COMPARTILHAMENTO,
                            null,
                            SharedPostResponseDTO.from(
                                    share,
                                    loggedUser.getId(),
                                    isFollowed,
                                    isFollowedSharer,
                                    postInteractionService.countShareLikes(share.getId()),
                                    postInteractionService.countShareComments(share.getId())
                            ),
                            share.getCreatedAt()
                    );
                }).toList();

        List<UnifiedPostResponseDTO> allItems = new ArrayList<>();
        allItems.addAll(postItems);
        allItems.addAll(shareItems);
        allItems.sort(comparator);

        int start = filter.page() * filter.size();
        int end = Math.min(start + filter.size(), allItems.size());

        List<UnifiedPostResponseDTO> pagedItems = start > allItems.size()
                ? List.of()
                : allItems.subList(start, end);

        return new PageImpl<>(pagedItems, PageRequest.of(filter.page(), filter.size()), allItems.size());
    }

}

