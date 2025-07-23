package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.response.*;
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

        var pros = searchProfessionals(q, limit6, loggedUserId);
        var comps = searchCompanies(q, limit6, loggedUserId);

        return new MainListingResponseDTO(pros, comps);
    }

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
        return toPagedResponse(pageResult);
    }

    /* ------------------ helpers ------------------ */

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
    }
}
