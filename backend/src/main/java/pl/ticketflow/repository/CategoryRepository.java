package pl.ticketflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.ticketflow.entity.Category;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIsNull();
    List<Category> findByParentId(Long parentId);
}
