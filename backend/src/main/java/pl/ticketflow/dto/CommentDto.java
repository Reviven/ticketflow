package pl.ticketflow.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CommentDto {
    private Long id;
    private String content;
    private UserSummaryDto author;
    private boolean internal;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
