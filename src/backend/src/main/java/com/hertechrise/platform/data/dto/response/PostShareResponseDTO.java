package com.hertechrise.platform.data.dto.response;

import java.time.LocalDateTime;

public record PostShareResponseDTO(
        Long id,
        Long userId,
        String userName,
        String userAvatarUrl,
        String content,
        LocalDateTime createdAt
) {}
