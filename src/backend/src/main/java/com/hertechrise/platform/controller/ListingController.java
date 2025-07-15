package com.hertechrise.platform.controller;

import com.hertechrise.platform.controller.docs.ListingControllerDocs;
import com.hertechrise.platform.data.dto.response.MainListingResponseDTO;
import com.hertechrise.platform.data.dto.response.PagedResponseDTO;
import com.hertechrise.platform.data.dto.response.UserSummaryResponseDTO;
import com.hertechrise.platform.services.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/listing")
@RequiredArgsConstructor
public class ListingController implements ListingControllerDocs {

    private final ListingService service;

    @GetMapping
    public MainListingResponseDTO getMain(@RequestParam(required = false) String q) {
        return service.mainListing(q);
    }

    @GetMapping("/professionals")
    public PagedResponseDTO<UserSummaryResponseDTO> professionals(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "name") Pageable page) {
        return service.pageProfessionals(q, page);
    }

    @GetMapping("/companies")
    public PagedResponseDTO<UserSummaryResponseDTO> companies(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "name") Pageable page) {
        return service.pageCompanies(q, page);
    }
}