package com.hertechrise.platform.data.dto.response;

public record PostMessageResponseDTO(
        String message,
        PostResponseDTO post
) {}
