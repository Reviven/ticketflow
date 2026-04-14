package pl.ticketflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.ticketflow.dto.CategoryDto;
import pl.ticketflow.entity.Category;
import pl.ticketflow.repository.CategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getRootCategories() {
        return categoryRepository.findByParentIsNull().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toDtoFlat)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono kategorii o ID: " + id));
        return toDto(category);
    }

    public CategoryDto createCategory(CategoryDto dto) {
        Category category = Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .slaMinutes(dto.getSlaMinutes())
                .build();

        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono kategorii nadrzędnej"));
            category.setParent(parent);
        }

        return toDto(categoryRepository.save(category));
    }

    private CategoryDto toDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .fullPath(category.getFullPath())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .slaMinutes(category.getSlaMinutes())
                .children(category.getChildren().stream().map(this::toDto).collect(Collectors.toList()))
                .build();
    }

    private CategoryDto toDtoFlat(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .fullPath(category.getFullPath())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .slaMinutes(category.getSlaMinutes())
                .build();
    }
}
