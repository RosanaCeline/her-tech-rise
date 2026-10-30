package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.PostCommentRequestDTO;
import com.hertechrise.platform.data.dto.request.PostShareRequestDTO;
import com.hertechrise.platform.data.dto.response.PostCommentResponseDTO;
import com.hertechrise.platform.data.dto.response.PostLikeResponseDTO;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostInteractionService {

    private final PostRepository postRepository;
    private final PostLikeRepository likeRepository;
    private final PostCommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final PostShareRepository shareRepository;

    @Transactional
    public void toggleLike(Long postId) {
        User user = currentUser();
        Post post = findVisiblePost(postId, user);

        likeRepository.findByUserAndPost(user, post).ifPresentOrElse(
                likeRepository::delete,
                () -> {
                    PostLike like = new PostLike();
                    like.setUser(user);
                    like.setPost(post);
                    like.setCreatedAt(LocalDateTime.now());
                    likeRepository.save(like);
                }
        );
    }

    @Transactional
    public PostCommentResponseDTO comment(Long postId, PostCommentRequestDTO dto) {
        User user = currentUser();
        Post post = findVisiblePost(postId, user);

        PostComment parentComment = null;
        if (dto.parentCommentId() != null) {
            parentComment = findComment(dto.parentCommentId(), "Comentário pai não encontrado");
            if (parentComment.getPost() == null || !parentComment.getPost().getId().equals(post.getId())) {
                throw new IllegalArgumentException("O comentário pai não pertence a esta postagem.");
            }
        }

        PostComment comment = new PostComment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(dto.content().trim());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setParentComment(parentComment);

        return PostCommentResponseDTO.from(commentRepository.save(comment), 0L, false);
    }

    @Transactional
    public void toggleCommentLike(Long commentId) {
        User user = currentUser();
        PostComment comment = findComment(commentId, "Comentário não encontrado");
        ensureCommentTargetVisible(comment, user);

        commentLikeRepository.findByUserAndComment(user, comment).ifPresentOrElse(
                commentLikeRepository::delete,
                () -> {
                    CommentLike like = new CommentLike();
                    like.setUser(user);
                    like.setComment(comment);
                    like.setCreatedAt(LocalDateTime.now());
                    commentLikeRepository.save(like);
                }
        );
    }

    @Transactional
    public void share(Long postId, PostShareRequestDTO dto) {
        User user = currentUser();
        Post post = findVisiblePost(postId, user);

        // compartilhar uma postagem privada exporia o conteúdo para outras pessoas
        if (post.getVisibility() != PostVisibility.PUBLICO) {
            throw new IllegalStateException("Apenas postagens públicas podem ser compartilhadas.");
        }

        String content = dto != null && dto.content() != null && !dto.content().isBlank()
                ? dto.content().trim()
                : null;

        PostShare share = new PostShare();
        share.setUser(user);
        share.setPost(post);
        share.setContent(content);
        share.setCreatedAt(LocalDateTime.now());

        shareRepository.save(share);
    }

    @Transactional
    public void toggleShareLike(Long shareId) {
        User user = currentUser();
        PostShare share = findVisibleShare(shareId, user);

        likeRepository.findByUserAndShare(user, share).ifPresentOrElse(
                likeRepository::delete,
                () -> {
                    PostLike like = new PostLike();
                    like.setUser(user);
                    like.setShare(share);
                    like.setCreatedAt(LocalDateTime.now());
                    likeRepository.save(like);
                }
        );
    }

    @Transactional
    public PostCommentResponseDTO commentOnShare(Long shareId, PostCommentRequestDTO dto) {
        User user = currentUser();
        PostShare share = findVisibleShare(shareId, user);

        PostComment parentComment = null;
        if (dto.parentCommentId() != null) {
            parentComment = findComment(dto.parentCommentId(), "Comentário pai não encontrado");
            if (parentComment.getShare() == null || !parentComment.getShare().getId().equals(share.getId())) {
                throw new IllegalArgumentException("O comentário pai não pertence a este compartilhamento.");
            }
        }

        PostComment comment = new PostComment();
        comment.setUser(user);
        comment.setShare(share);
        comment.setContent(dto.content().trim());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setParentComment(parentComment);

        return PostCommentResponseDTO.from(commentRepository.save(comment), 0L, false);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        User user = currentUser();
        PostComment comment = findComment(commentId, "Comentário não encontrado");

        // pode excluir: quem comentou, o autor da postagem ou o dono do compartilhamento comentado
        boolean isCommentAuthor = comment.getUser().getId().equals(user.getId());
        boolean isPostAuthor = comment.getPost() != null
                && comment.getPost().getAuthor().getId().equals(user.getId());
        boolean isShareOwner = comment.getShare() != null
                && comment.getShare().getUser().getId().equals(user.getId());

        if (!isCommentAuthor && !isPostAuthor && !isShareOwner) {
            throw new SecurityException("Você não tem permissão para excluir este comentário");
        }

        commentRepository.delete(comment);
    }

    @Transactional
    public void deleteShare(Long shareId) {
        User user = currentUser();

        PostShare share = shareRepository.findById(shareId)
                .orElseThrow(() -> new EntityNotFoundException("Compartilhamento não encontrado"));

        if (!share.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Você não tem permissão para excluir este compartilhamento");
        }

        shareRepository.delete(share);
    }

    @Transactional(readOnly = true)
    public List<PostLikeResponseDTO> listLikes(Long postId) {
        Post post = findVisiblePost(postId, currentUser());

        return likeRepository.findAllWithUserByPostId(post.getId()).stream()
                .map(like -> PostLikeResponseDTO.from(like.getId(), like.getUser(), like.getCreatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostLikeResponseDTO> listCommentLikes(Long commentId) {
        PostComment comment = findComment(commentId, "Comentário não encontrado");
        ensureCommentTargetVisible(comment, currentUser());

        return commentLikeRepository.findAllWithUserByCommentId(comment.getId()).stream()
                .map(like -> PostLikeResponseDTO.from(like.getId(), like.getUser(), like.getCreatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostLikeResponseDTO> listShareLikes(Long shareId) {
        PostShare share = findVisibleShare(shareId, currentUser());

        return likeRepository.findAllWithUserByShareId(share.getId()).stream()
                .map(like -> PostLikeResponseDTO.from(like.getId(), like.getUser(), like.getCreatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostCommentResponseDTO> listComments(Long postId) {
        User user = currentUser();
        Post post = findVisiblePost(postId, user);

        return toCommentResponses(commentRepository.findAllWithUserByPostId(post.getId()), user);
    }

    @Transactional(readOnly = true)
    public List<PostCommentResponseDTO> listShareComments(Long shareId) {
        User user = currentUser();
        PostShare share = findVisibleShare(shareId, user);

        return toCommentResponses(commentRepository.findAllWithUserByShareId(share.getId()), user);
    }

    private List<PostCommentResponseDTO> toCommentResponses(List<PostComment> comments, User viewer) {
        if (comments.isEmpty()) {
            return List.of();
        }

        List<Long> ids = comments.stream().map(PostComment::getId).toList();
        Map<Long, Long> likes = new HashMap<>();
        for (Object[] row : commentLikeRepository.countByCommentIds(ids)) {
            likes.put((Long) row[0], (Long) row[1]);
        }
        Set<Long> liked = new HashSet<>(commentLikeRepository.findCommentIdsLikedByUser(viewer.getId(), ids));

        return comments.stream()
                .map(comment -> PostCommentResponseDTO.from(
                        comment,
                        likes.getOrDefault(comment.getId(), 0L),
                        liked.contains(comment.getId())))
                .toList();
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User) auth.getPrincipal();
    }

    /**
     * Postagem visível para o usuário: não excluída e pública, ou de autoria dele.
     * Para as demais responde "não encontrada", sem revelar que a postagem existe.
     */
    private Post findVisiblePost(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Postagem não encontrada"));
        if (!isVisible(post, user)) {
            throw new EntityNotFoundException("Postagem não encontrada");
        }
        return post;
    }

    private PostShare findVisibleShare(Long shareId, User user) {
        PostShare share = shareRepository.findById(shareId)
                .orElseThrow(() -> new EntityNotFoundException("Compartilhamento não encontrado"));
        if (!isVisible(share.getPost(), user)) {
            throw new EntityNotFoundException("Compartilhamento não encontrado");
        }
        return share;
    }

    private PostComment findComment(Long commentId, String notFoundMessage) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException(notFoundMessage));
    }

    private void ensureCommentTargetVisible(PostComment comment, User user) {
        Post target = comment.getPost() != null ? comment.getPost() : comment.getShare().getPost();
        if (!isVisible(target, user)) {
            throw new EntityNotFoundException("Comentário não encontrado");
        }
    }

    private static boolean isVisible(Post post, User user) {
        if (post == null || post.isDeleted()) {
            return false;
        }
        return post.getVisibility() == PostVisibility.PUBLICO
                || post.getAuthor().getId().equals(user.getId());
    }

    public Long countLikes(Long postId) {
        return likeRepository.countByPostId(postId);
    }
    public Long countShareLikes(Long shareId) {
        return likeRepository.countByShareId(shareId);
    }

    public Long countCommentLikes(Long commentId) {
        return commentLikeRepository.countByCommentId(commentId);
    }

    public Long countComments(Long postId) {
        return commentRepository.countByPostId(postId);
    }

    public Long countShareComments(Long shareId) {
        return commentRepository.countByShareId(shareId);
    }

    public Long countShares(Long postId) {
        return shareRepository.countByPostId(postId);
    }
}
