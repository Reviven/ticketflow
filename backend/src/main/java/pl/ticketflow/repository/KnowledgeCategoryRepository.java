package pl.ticketflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.ticketflow.entity.KnowledgeCategory;

public interface KnowledgeCategoryRepository extends JpaRepository<KnowledgeCategory, Long> {
}
