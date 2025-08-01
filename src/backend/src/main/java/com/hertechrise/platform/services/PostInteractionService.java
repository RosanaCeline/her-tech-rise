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
import java.util.List;

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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Postagem não encontrada"));

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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Postagem não encontrada"));

        PostComment parentComment = null;

        if(dto.parentCommentId() != null) {
            parentComment = commentRepository.findById(dto.parentCommentId())
                    .orElseThrow(() -> new EntityNotFoundException("Comentário pai não encontrado"));
        }

        PostComment comment = new PostComment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(dto.content());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setParentComment(parentComment);

        comment = commentRepository.save(comment);

        return new PostCommentResponseDTO(
                comment.getId(),
                user.getId(),
                user.getName(),
                user.getProfilePic(),
                comment.getContent(),
                comment.isEdited(),
                comment.getCreatedAt(),
                comment.getParentComment() != null ? comment.getParentComment().getId() : null,
                countCommentLikes(comment.getId())
        );
    }

    @Transactional
    public void toggleCommentLike(Long commentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        PostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comentário não encontrado"));

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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Postagem não encontrada"));

        PostShare share = new PostShare();
        share.setUser(user);
        share.setPost(post);
        share.setContent(dto.content());
        share.setCreatedAt(LocalDateTime.now());

        shareRepository.save(share);
    }

    @Transactional
    public void toggleShareLike(Long shareId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        PostShare share = shareRepository.findById(shareId)
                .orElseThrow(() -> new EntityNotFoundException("Compartilhamento não encontrado"));

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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        PostShare share = shareRepository.findById(shareId)
                .orElseThrow(() -> new EntityNotFoundException("Compartilhamento não encontrado"));

        PostComment parentComment = null;
        if (dto.parentCommentId() != null) {
            parentComment = commentRepository.findById(dto.parentCommentId())
                    .orElseThrow(() -> new EntityNotFoundException("Comentário pai não encontrado"));
        }

        PostComment comment = new PostComment();
        comment.setUser(user);
        comment.setShare(share);
        comment.setContent(dto.content());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setParentComment(parentComment);

        comment = commentRepository.save(comment);

        return new PostCommentResponseDTO(
                comment.getId(),
                user.getId(),
                user.getName(),
                user.getProfilePic(),
                comment.getContent(),
                comment.isEdited(),
                comment.getCreatedAt(),
                comment.getParentComment() != null ? comment.getParentComment().getId() : null,
                countCommentLikes(comment.getId())
        );
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        PostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comentário não encontrado"));

        if (!comment.getUser().getId().equals(user.getId()) && !comment.getPost().getAuthor().getId().equals(user.getId())) {
            throw new SecurityException("Você não tem permissão para excluir este comentário");
        }

        commentRepository.delete(comment);
    }

    @Transactional
    public void deleteShare(Long shareId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        PostShare share = shareRepository.findById(shareId)
                .orElseThrow(() -> new EntityNotFoundException("Compartilhamento não encontrado"));

        if (!share.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Você não tem permissão para excluir este compartilhamento");
        }

        shareRepository.delete(share);
    }

    @Transactional(readOnly = true)
    public List<PostLikeResponseDTO> listLikes(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Postagem não encontrada"));

        return likeRepository.findByPost(post).stream()
                .map(like -> new PostLikeResponseDTO(
                        like.getId(),
                        like.getUser().getId(),
                        like.getUser().getName(),
                        like.getUser().getProfilePic(),
                        like.getCreatedAt()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostLikeResponseDTO> listCommentLikes(Long commentId) {
        PostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comentário não encontrado"));

        return commentLikeRepository.findByComment(comment).stream()
                .map(like -> new PostLikeResponseDTO(
                        like.getId(),
                        like.getUser().getId(),
                        like.getUser().getName(),
                        like.getUser().getProfilePic(),
                        like.getCreatedAt()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostLikeResponseDTO> listShareLikes(Long shareId) {
        PostShare share = shareRepository.findById(shareId)
                .orElseThrow(() -> new EntityNotFoundException("Compartilhamento não encontrado"));

        return likeRepository.findByShare(share).stream()
                .map(like -> new PostLikeResponseDTO(
                        like.getId(),
                        like.getUser().getId(),
                        like.getUser().getName(),
                        like.getUser().getProfilePic(),
                        like.getCreatedAt()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostCommentResponseDTO> listComments(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Postagem não encontrada"));

        return commentRepository.findByPost(post).stream()
                .map(comment -> new PostCommentResponseDTO(
                        comment.getId(),
                        comment.getUser().getId(),
                        comment.getUser().getName(),
                        comment.getUser().getProfilePic(),
                        comment.getContent(),
                        comment.isEdited(),
                        comment.getCreatedAt(),
                        comment.getParentComment() != null ? comment.getParentComment().getId() : null,
                        countCommentLikes(comment.getId())
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostCommentResponseDTO> listShareComments(Long shareId) {
        PostShare share = shareRepository.findById(shareId)
                .orElseThrow(() -> new EntityNotFoundException("Compartilhamento não encontrado"));

        return commentRepository.findByShare(share).stream()
                .map(comment -> new PostCommentResponseDTO(
                        comment.getId(),
                        comment.getUser().getId(),
                        comment.getUser().getName(),
                        comment.getUser().getProfilePic(),
                        comment.getContent(),
                        comment.isEdited(),
                        comment.getCreatedAt(),
                        comment.getParentComment() != null ? comment.getParentComment().getId() : null,
                        countCommentLikes(comment.getId())
                ))
                .toList();
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
