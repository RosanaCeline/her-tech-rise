package com.hertechrise.platform.data.dto.request;

import com.hertechrise.platform.model.MediaType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Pattern;
import org.springframework.web.multipart.MultipartFile;

public record MediaEditRequestDTO(

        Long id, // Se presente, é mídia antiga

        MultipartFile file, // Se presente, é mídia nova

        MediaType mediaType,

        @Pattern(regexp = "^(image|video|application)/.+$", message = "MIME inválido.")
        String mimeType,

        String url

) {

    @AssertTrue(message = "Para novas mídias, tipo e MIME são obrigatórios.")
    public boolean isValidNewMedia() {
        if (id == null && file != null) {
            return mediaType != null && mimeType != null && !mimeType.isBlank();
        }
        return true; // Se é mídia antiga, não precisa validar isso
    }

    @AssertTrue(message = "Para mídias antigas, id e URL devem estar presentes.")
    public boolean isValidOldMedia() {
        if (id != null && file == null) {
            return url != null && !url.isBlank();
        }
        return true; // Se é mídia nova, não precisa validar isso
    }
}
