package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.ExperienceRequestDTO;
import com.hertechrise.platform.model.Experience;
import com.hertechrise.platform.model.Professional;
import com.hertechrise.platform.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository experienceRepo;

    @Transactional
    public void syncExperiences(Professional professional, List<ExperienceRequestDTO> incoming) {
        Map<Long, Experience> current = professional.getExperiences().stream()
                .filter(e -> e.getId() != null)
                .collect(Collectors.toMap(Experience::getId, e -> e));

        for (ExperienceRequestDTO dto : incoming) {
            if (dto.id() == null) {
                Experience newExperience = toExperience(dto, professional);
                professional.getExperiences().add(newExperience);
            } else {
                Experience oldExperience = current.remove(dto.id());
                if (oldExperience != null) {
                    copyExperienceFields(dto, oldExperience);
                }
            }
        }

        professional.getExperiences().removeAll(current.values());
    }

    private Experience toExperience(ExperienceRequestDTO dto, Professional professional) {
        Experience exp = new Experience();
        copyExperienceFields(dto, exp);
        exp.setProfessional(professional);
        return exp;
    }

    private void copyExperienceFields(ExperienceRequestDTO dto, Experience entity) {
        entity.setTitle(dto.title());
        entity.setCompany(dto.company());
        entity.setModality(dto.modality());
        entity.setStartDate(dto.startDate());
        entity.setEndDate(dto.endDate());
        entity.setCurrent(dto.isCurrent());
        entity.setDescription(dto.description());
    }
}
