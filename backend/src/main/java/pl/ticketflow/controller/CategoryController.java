package pl.ticketflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.ticketflow.dto.CategoryDto;
import pl.ticketflow.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories(@RequestParam(defaultValue = "false") boolean flat) {
        if (flat) {
            return ResponseEntity.ok(categoryService.getAllCategories());
        }
        return ResponseEntity.ok(categoryService.getRootCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto dto) {
        return ResponseEntity.ok(categoryService.createCategory(dto));
    }
}
