package pl.ticketflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.ticketflow.dto.KnowledgeArticleDto;
import pl.ticketflow.dto.KnowledgeCategoryDto;
import pl.ticketflow.service.KnowledgeService;

import java.util.List;

@RestController
@RequestMapping("/knowledge")
@RequiredArgsConstructor
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    @GetMapping("/categories")
    public ResponseEntity<List<KnowledgeCategoryDto>> getCategories() {
        return ResponseEntity.ok(knowledgeService.getCategories());
    }

    @GetMapping("/articles")
    public ResponseEntity<Page<KnowledgeArticleDto>> getArticles(
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(knowledgeService.getArticles(categoryId, pageable));
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<KnowledgeArticleDto> getArticle(@PathVariable Long id) {
        return ResponseEntity.ok(knowledgeService.getArticle(id));
    }

    @PostMapping("/articles")
    public ResponseEntity<KnowledgeArticleDto> createArticle(
            @RequestBody KnowledgeArticleDto dto,
            Authentication authentication) {
        return ResponseEntity.ok(knowledgeService.createArticle(dto, authentication.getName()));
    }
}
