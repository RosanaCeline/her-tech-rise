package com.hertechrise.platform.services;

<<<<<<< HEAD
import com.hertechrise.platform.data.dto.response.MainListingResponseDTO;
import com.hertechrise.platform.data.dto.response.PagedResponseDTO;
import com.hertechrise.platform.data.dto.response.UserSummaryResponseDTO;
=======
import com.hertechrise.platform.data.dto.response.*;
>>>>>>> main
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.model.UserType;
import com.hertechrise.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListingService {

    private final UserRepository userRepository;
    private final FollowService followService;

    public MainListingResponseDTO mainListing(String q) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long loggedUserId = ((User) auth.getPrincipal()).getId();

        Pageable limit6 = PageRequest.of(0, 6, Sort.by("name"));
<<<<<<< HEAD
        var pros = search(UserType.PROFESSIONAL, q, limit6, loggedUserId);
        var comps = search(UserType.COMPANY, q, limit6, loggedUserId);
=======

        var pros = searchProfessionals(q, limit6, loggedUserId);
        var comps = searchCompanies(q, limit6, loggedUserId);
>>>>>>> main

        return new MainListingResponseDTO(pros, comps);
    }

<<<<<<< HEAD
    public PagedResponseDTO<UserSummaryResponseDTO> pageProfessionals(String q, Pageable page) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long loggedUserId = ((User) auth.getPrincipal()).getId();

        Page<UserSummaryResponseDTO> pageResult = searchPaged(UserType.PROFESSIONAL, q, page, loggedUserId);
        return toPagedResponse(pageResult);
    }

    public PagedResponseDTO<UserSummaryResponseDTO> pageCompanies(String q, Pageable page) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long loggedUserId = ((User) auth.getPrincipal()).getId();

        Page<UserSummaryResponseDTO> pageResult = searchPaged(UserType.COMPANY, q, page, loggedUserId);
=======
    public PagedResponseDTO<ProfessionalSummaryResponseDTO> pageProfessionals(String q, Pageable page) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long loggedUserId = ((User) auth.getPrincipal()).getId();

        Page<ProfessionalSummaryResponseDTO> pageResult = searchProfessionalsPaged(q, page, loggedUserId);
        return toPagedResponse(pageResult);
    }

    public PagedResponseDTO<CompanySummaryResponseDTO> pageCompanies(String q, Pageable page) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long loggedUserId = ((User) auth.getPrincipal()).getId();

        Page<CompanySummaryResponseDTO> pageResult = searchCompaniesPaged(q, page, loggedUserId);
>>>>>>> main
        return toPagedResponse(pageResult);
    }

    /* ------------------ helpers ------------------ */

<<<<<<< HEAD
    private List<UserSummaryResponseDTO> search(UserType type, String q, Pageable p, Long loggedUserId) {
        return searchPaged(type, q, p, loggedUserId).getContent();
    }

    private Page<UserSummaryResponseDTO> searchPaged(UserType type, String q, Pageable p, Long loggedUserId) {
        String term = (q == null) ? "" : q.trim();
        return userRepository
                .findByTypeAndIdNotAndNameContainingIgnoreCaseOrTypeAndIdNotAndHandleContainingIgnoreCase(
                        type, loggedUserId, term, type, loggedUserId, term, p, UserRepository.Summary.class)
                .map(u -> new UserSummaryResponseDTO(
                        u.getId(), u.getName(), u.getHandle(), u.getCity(), u.getProfilePic()));
=======
    private List<ProfessionalSummaryResponseDTO> searchProfessionals(String q, Pageable p, Long loggedUserId) {
        return searchProfessionalsPaged(q, p, loggedUserId).getContent();
    }

    private List<CompanySummaryResponseDTO> searchCompanies(String q, Pageable p, Long loggedUserId) {
        return searchCompaniesPaged(q, p, loggedUserId).getContent();
    }

    private Page<ProfessionalSummaryResponseDTO> searchProfessionalsPaged(String q, Pageable p, Long loggedUserId) {
        String term = (q == null) ? "" : q.trim();

        Page<UserRepository.ProfessionalSummary> page = userRepository
                .searchProfessionalsPagedWithTechnology(term, loggedUserId, p);

        List<Long> userIds = page.stream().map(UserRepository.ProfessionalSummary::getId).toList();
        Map<Long, Long> followersMap = followService.countFollowersListing(userIds);

        return page.map(u -> new ProfessionalSummaryResponseDTO(
                u.getId(),
                u.getName(),
                u.getHandle(),
                u.getTechnology(),
                followersMap.getOrDefault(u.getId(), 0L),
                u.getCity(),
                u.getUf(),
                u.getProfilePic()
        ));
    }

    private Page<CompanySummaryResponseDTO> searchCompaniesPaged(String q, Pageable p, Long loggedUserId) {
        String term = (q == null) ? "" : q.trim();

        Page<UserRepository.CompanySummary> page = userRepository
                .findByTypeAndIdNotAndNameContainingIgnoreCaseOrTypeAndIdNotAndHandleContainingIgnoreCase(
                        UserType.COMPANY, loggedUserId, term,
                        UserType.COMPANY, loggedUserId, term, p, UserRepository.CompanySummary.class
                );

        List<Long> userIds = page.stream().map(UserRepository.CompanySummary::getId).toList();
        Map<Long, Long> followersMap = followService.countFollowersListing(userIds);

        return page.map(u -> new CompanySummaryResponseDTO(
                u.getId(),
                u.getName(),
                u.getHandle(),
                followersMap.getOrDefault(u.getId(), 0L),
                u.getCity(),
                u.getUf(),
                u.getProfilePic()
        ));
>>>>>>> main
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
