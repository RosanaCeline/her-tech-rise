package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.response.PostResponseDTO;
import com.hertechrise.platform.data.dto.response.SharedPostResponseDTO;
import com.hertechrise.platform.data.dto.response.UnifiedPostResponseDTO;
import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.PostContentType;
import com.hertechrise.platform.model.PostShare;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.repository.FollowRelationshipRepository;
import com.hertechrise.platform.repository.PostCommentRepository;
import com.hertechrise.platform.repository.PostLikeRepository;
import com.hertechrise.platform.repository.PostRepository;
import com.hertechrise.platform.repository.PostShareRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

/**
 * Monta os itens de feed (postagens e compartilhamentos) com contadores,
 * curtidas e "seguindo" calculados em lote, evitando consultas por item (N+1).
 */
@Component
@RequiredArgsConstructor
public class PostFeedAssembler {

    private final PostRepository postRepository;
    private final PostLikeRepository likeRepository;
    private final PostCommentRepository commentRepository;
    private final PostShareRepository shareRepository;
    private final FollowRelationshipRepository followRelationshipRepository;

    /**
     * @param includeSharerFollow quando falso, {@code sharingUser.isFollowed} volta nulo
     *                            (caso do próprio perfil, em que quem compartilhou é o usuário logado).
     */
    public List<UnifiedPostResponseDTO> assemble(List<Post> posts, List<PostShare> shares, User viewer,
                                                 boolean includeSharerFollow) {
        if (posts.isEmpty() && shares.isEmpty()) {
            return List.of();
        }

        List<Long> postIds = posts.stream().map(Post::getId).toList();
        List<Long> shareIds = shares.stream().map(PostShare::getId).toList();

        // carrega autor e mídias de todas as postagens envolvidas em uma única consulta
        Set<Long> postsToPreload = new HashSet<>(postIds);
        shares.forEach(share -> postsToPreload.add(share.getPost().getId()));
        postRepository.findAllWithAuthorAndMediaByIdIn(postsToPreload);

        Map<Long, Long> postLikes = toCountMap(postIds.isEmpty() ? List.of() : likeRepository.countByPostIds(postIds));
        Map<Long, Long> postComments = toCountMap(postIds.isEmpty() ? List.of() : commentRepository.countByPostIds(postIds));
        Map<Long, Long> postShares = toCountMap(postIds.isEmpty() ? List.of() : shareRepository.countByPostIds(postIds));
        Set<Long> likedPosts = postIds.isEmpty() ? Set.of()
                : new HashSet<>(likeRepository.findPostIdsLikedByUser(viewer.getId(), postIds));

        Map<Long, Long> shareLikes = toCountMap(shareIds.isEmpty() ? List.of() : likeRepository.countByShareIds(shareIds));
        Map<Long, Long> shareComments = toCountMap(shareIds.isEmpty() ? List.of() : commentRepository.countByShareIds(shareIds));
        Set<Long> likedShares = shareIds.isEmpty() ? Set.of()
                : new HashSet<>(likeRepository.findShareIdsLikedByUser(viewer.getId(), shareIds));

        Set<Long> followed = findFollowed(viewer, Stream.concat(
                posts.stream().map(post -> post.getAuthor().getId()),
                shares.stream().flatMap(share -> Stream.of(
                        share.getPost().getAuthor().getId(),
                        share.getUser().getId()))
        ).toList());

        Stream<UnifiedPostResponseDTO> postItems = posts.stream().map(post -> new UnifiedPostResponseDTO(
                PostContentType.POSTAGEM,
                PostResponseDTO.from(
                        post,
                        viewer.getId(),
                        followed.contains(post.getAuthor().getId()),
                        postLikes.getOrDefault(post.getId(), 0L),
                        postComments.getOrDefault(post.getId(), 0L),
                        postShares.getOrDefault(post.getId(), 0L),
                        likedPosts.contains(post.getId())
                ),
                null,
                post.getCreatedAt()
        ));

        Stream<UnifiedPostResponseDTO> shareItems = shares.stream().map(share -> new UnifiedPostResponseDTO(
                PostContentType.COMPARTILHAMENTO,
                null,
                SharedPostResponseDTO.from(
                        share,
                        viewer.getId(),
                        followed.contains(share.getPost().getAuthor().getId()),
                        includeSharerFollow ? followed.contains(share.getUser().getId()) : null,
                        shareLikes.getOrDefault(share.getId(), 0L),
                        shareComments.getOrDefault(share.getId(), 0L),
                        likedShares.contains(share.getId())
                ),
                share.getCreatedAt()
        ));

        return Stream.concat(postItems, shareItems).toList();
    }

    private Set<Long> findFollowed(User viewer, Collection<Long> userIds) {
        Set<Long> others = new HashSet<>(userIds);
        others.remove(viewer.getId());
        return others.isEmpty() ? Set.of()
                : new HashSet<>(followRelationshipRepository.findFollowedIdsAmong(viewer.getId(), others));
    }

    private static Map<Long, Long> toCountMap(List<Object[]> rows) {
        Map<Long, Long> counts = new HashMap<>();
        for (Object[] row : rows) {
            counts.put((Long) row[0], (Long) row[1]);
        }
        return counts;
    }
}
