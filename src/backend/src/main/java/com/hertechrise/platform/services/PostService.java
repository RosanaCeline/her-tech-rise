package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.PostRequestDTO;
import com.hertechrise.platform.model.Media;
import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.repository.CommunityRepository;
import com.hertechrise.platform.repository.PostRepository;
import com.hertechrise.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommunityRepository communityRepository;

    private final MediaService mediaService;

    public void post(PostRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        Post post = new Post();
        post.setAuthor(loggedUser);
        post.setContent(request.content());

        if (request.idCommunity() != null) {
            communityRepository.findById(request.idCommunity()).ifPresent(post::setCommunity);
        }

        // Mídias (se houver)
        if (request.media() != null && !request.media().isEmpty()) {
            List<Media> mediaList = mediaService.buildMediaEntities(post, request.media());
            post.setMedia(mediaList);
        }

        Post saved = postRepository.save(post);
    }
}
