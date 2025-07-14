package com.hertechrise.platform.data.dto.response;

import java.time.LocalDateTime;

public record PostCommentResponseDTO(
        Long id,
        Long userId,
        String userName,
        String userAvatarUrl,
        String content,
        boolean edited,
        LocalDateTime createdAt
) {}
