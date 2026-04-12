package pl.ticketflow.dto;

import lombok.*;
import pl.ticketflow.entity.TicketPriority;
import pl.ticketflow.entity.TicketStatus;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UpdateTicketRequest {
    private String title;
    private String description;
    private TicketStatus status;
    private TicketPriority priority;
    private Long categoryId;
    private Long assigneeId;
    private String location;
    private LocalDateTime dueDate;
    private String cmdbAsset;
}
