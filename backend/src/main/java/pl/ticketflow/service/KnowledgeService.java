package pl.ticketflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ticketflow.dto.KnowledgeArticleDto;
import pl.ticketflow.dto.KnowledgeCategoryDto;
import pl.ticketflow.entity.KnowledgeArticle;
import pl.ticketflow.entity.KnowledgeCategory;
import pl.ticketflow.entity.User;
import pl.ticketflow.repository.KnowledgeArticleRepository;
import pl.ticketflow.repository.KnowledgeCategoryRepository;
import pl.ticketflow.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KnowledgeService {

    private final KnowledgeCategoryRepository categoryRepository;
    private final KnowledgeArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public List<KnowledgeCategoryDto> getCategories() {
        return categoryRepository.findAll().stream()
                .map(cat -> KnowledgeCategoryDto.builder()
                        .id(cat.getId())
                        .name(cat.getName())
                        .description(cat.getDescription())
                        .icon(cat.getIcon())
                        .color(cat.getColor())
                        .articleCount(articleRepository.countByCategoryId(cat.getId()))
                        .build())
                .collect(Collectors.toList());
    }

    public Page<KnowledgeArticleDto> getArticles(Long categoryId, Pageable pageable) {
        Page<KnowledgeArticle> articles;
        if (categoryId != null) {
            articles = articleRepository.findByCategoryId(categoryId, pageable);
        } else {
            articles = articleRepository.findByPublishedTrue(pageable);
        }
        return articles.map(this::toDto);
    }

    public KnowledgeArticleDto getArticle(Long id) {
        KnowledgeArticle article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono artykułu o ID: " + id));
        article.setViewCount(article.getViewCount() + 1);
        articleRepository.save(article);
        return toDto(article);
    }

    @Transactional
    public KnowledgeArticleDto createArticle(KnowledgeArticleDto dto, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        KnowledgeArticle article = KnowledgeArticle.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .author(author)
                .published(dto.isPublished())
                .build();

        if (dto.getCategoryId() != null) {
            KnowledgeCategory category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono kategorii"));
            article.setCategory(category);
        }

        return toDto(articleRepository.save(article));
    }

    private KnowledgeArticleDto toDto(KnowledgeArticle article) {
        return KnowledgeArticleDto.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .categoryId(article.getCategory() != null ? article.getCategory().getId() : null)
                .categoryName(article.getCategory() != null ? article.getCategory().getName() : null)
                .author(userService.toSummaryDto(article.getAuthor()))
                .published(article.isPublished())
                .viewCount(article.getViewCount())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }
}
