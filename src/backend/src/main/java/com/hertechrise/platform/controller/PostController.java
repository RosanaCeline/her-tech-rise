package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.PostControllerDocs;
import com.hertechrise.platform.data.dto.request.PostRequestDTO;
import com.hertechrise.platform.data.dto.response.PostResponseDTO;
import com.hertechrise.platform.services.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController implements PostControllerDocs {

    private final PostService postService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDTO> create(
            @RequestParam(required = false) String content,
            @RequestParam(required = false) Long idCommunity,
            @RequestPart(required = false) List<MultipartFile> mediaFiles
    ) {
        PostRequestDTO dto = postService.processPostData(content, idCommunity, mediaFiles);
        PostResponseDTO response = postService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
