package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.response.MainListingResponseDTO;
import com.hertechrise.platform.data.dto.response.PagedResponseDTO;
import com.hertechrise.platform.data.dto.response.UserSummaryResponseDTO;
import com.hertechrise.platform.model.UserType;
import com.hertechrise.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListingService {

    private final UserRepository userRepository;

    public MainListingResponseDTO mainListing(String q) {
        Pageable limit6 = PageRequest.of(0, 6, Sort.by("name"));
        var pros = search(UserType.PROFESSIONAL, q, limit6);
        var comps = search(UserType.COMPANY, q, limit6);

        return new MainListingResponseDTO(pros, comps);
    }

    public PagedResponseDTO<UserSummaryResponseDTO> pageProfessionals(String q, Pageable page) {
        Page<UserSummaryResponseDTO> pageResult = searchPaged(UserType.PROFESSIONAL, q, page);
        return new PagedResponseDTO<>(
                pageResult.getContent(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.isFirst(),
                pageResult.isLast()
        );
    }

    public PagedResponseDTO<UserSummaryResponseDTO> pageCompanies(String q, Pageable page) {
        Page<UserSummaryResponseDTO> pageResult = searchPaged(UserType.COMPANY, q, page);
        return new PagedResponseDTO<>(
                pageResult.getContent(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.isFirst(),
                pageResult.isLast()
        );
    }

    /* ------------------ helpers ------------------ */

    private List<UserSummaryResponseDTO> search(UserType type, String q, Pageable p) {
        return searchPaged(type, q, p).getContent();
    }

    private Page<UserSummaryResponseDTO> searchPaged(UserType type, String q, Pageable p) {
        String term = (q == null) ? "" : q.trim();
        return userRepository
                .findByTypeAndNameContainingIgnoreCaseOrTypeAndUsernameContainingIgnoreCase(
                        type, term, type, term, p, UserRepository.Summary.class)
                .map(u -> new UserSummaryResponseDTO(
                        u.getId(), u.getName(), u.getUsername(), u.getCity(), u.getProfilePic()));
    }

    private <T> PagedResponseDTO<T> toPagedResponse(Page<T> page) {
        return new PagedResponseDTO<>(
                page.getContent(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize(),
                page.isLast(),
                page.isFirst()
        );
    }
}
