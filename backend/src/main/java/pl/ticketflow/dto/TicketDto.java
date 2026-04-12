package pl.ticketflow.dto;

import lombok.*;
import pl.ticketflow.entity.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TicketDto {
    private Long id;
    private String ticketNumber;
    private String title;
    private String description;
    private TicketStatus status;
    private TicketPriority priority;
    private TicketType type;
    private Long categoryId;
    private String categoryName;
    private UserSummaryDto requester;
    private UserSummaryDto assignee;
    private String location;
    private LocalDateTime dueDate;
    private Integer slaMinutes;
    private String cmdbAsset;
    private List<CommentDto> comments;
    private Set<String> tags;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
}
