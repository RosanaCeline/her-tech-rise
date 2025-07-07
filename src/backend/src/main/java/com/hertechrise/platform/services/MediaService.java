package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.MediaRequestDTO;
import com.hertechrise.platform.model.Media;
import com.hertechrise.platform.model.Post;
import com.hertechrise.platform.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;

    public List<Media> buildMediaEntities(Post post, List<MediaRequestDTO> dtos) {

        if (dtos == null || dtos.isEmpty()) return List.of();

        return dtos.stream().map(dto -> {
            Media media = new Media();
            media.setPost(post);
            media.setMediaType(dto.mediaType());
            media.setMimeType(dto.mimeType());
            media.setUrl(dto.url());
            // aqui você poderia validar MIME, gerar thumbnails, etc.
            return media;
        }).toList();
    }
}
