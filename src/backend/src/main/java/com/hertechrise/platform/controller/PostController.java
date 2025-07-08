package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.PostControllerDocs;
import com.hertechrise.platform.data.dto.request.PostRequestDTO;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import com.hertechrise.platform.services.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController implements PostControllerDocs {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<MessageResponseDTO> post(@RequestBody @Valid PostRequestDTO request){
        postService.post(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new MessageResponseDTO("Postagem criada com sucesso."));
    }
}
