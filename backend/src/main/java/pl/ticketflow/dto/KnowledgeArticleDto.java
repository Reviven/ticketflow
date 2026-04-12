package pl.ticketflow.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class KnowledgeArticleDto {
    private Long id;
    private String title;
    private String content;
    private Long categoryId;
    private String categoryName;
    private UserSummaryDto author;
    private boolean published;
    private int viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
