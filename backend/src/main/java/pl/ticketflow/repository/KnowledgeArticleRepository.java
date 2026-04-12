package pl.ticketflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.ticketflow.entity.KnowledgeArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, Long> {
    Page<KnowledgeArticle> findByCategoryId(Long categoryId, Pageable pageable);
    Page<KnowledgeArticle> findByPublishedTrue(Pageable pageable);
    long countByCategoryId(Long categoryId);
}
