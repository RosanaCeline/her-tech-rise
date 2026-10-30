package com.hertechrise.platform.repository;

import com.hertechrise.platform.model.PostContentType;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Paginação da timeline direto no banco: une postagens e compartilhamentos
 * públicos em uma única consulta ordenada, retornando apenas os IDs da página.
 */
@Repository
@RequiredArgsConstructor
public class TimelineRepository {

    private static final String PUBLIC_ITEMS = """
        SELECT 'POSTAGEM' AS item_type, p.id AS item_id, p.created_at AS created_at
        FROM post p
        WHERE p.deleted = false AND p.visibility = 'PUBLICO'
        UNION ALL
        SELECT 'COMPARTILHAMENTO', s.id, s.created_at
        FROM post_share s
        JOIN post p ON p.id = s.post_id
        WHERE p.deleted = false AND p.visibility = 'PUBLICO'
    """;

    private final EntityManager entityManager;

    public record TimelineItemRef(PostContentType type, Long id) {}

    public Page<TimelineItemRef> findPublicItems(Pageable pageable, boolean ascending) {
        // direção vem de valor fixo (nunca de texto do usuário), sem risco de SQL injection
        String direction = ascending ? "ASC" : "DESC";

        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery(
                        "SELECT t.item_type, t.item_id FROM (" + PUBLIC_ITEMS + ") t " +
                        "ORDER BY t.created_at " + direction + ", t.item_type, t.item_id " + direction)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        List<TimelineItemRef> content = rows.stream()
                .map(row -> new TimelineItemRef(
                        PostContentType.valueOf((String) row[0]),
                        ((Number) row[1]).longValue()))
                .toList();

        long total = ((Number) entityManager
                .createNativeQuery("SELECT COUNT(*) FROM (" + PUBLIC_ITEMS + ") t")
                .getSingleResult()).longValue();

        return new PageImpl<>(content, pageable, total);
    }
}
