package pl.ticketflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import pl.ticketflow.entity.TicketPriority;
import pl.ticketflow.entity.TicketType;
import java.time.LocalDateTime;
import java.util.Set;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CreateTicketRequest {
    @NotBlank(message = "Tytuł jest wymagany")
    private String title;

    private String description;

    @NotNull(message = "Typ zgłoszenia jest wymagany")
    private TicketType type;

    private TicketPriority priority;

    private Long categoryId;
    private Long assigneeId;
    private String location;
    private LocalDateTime dueDate;
    private String cmdbAsset;
    private Set<String> tags;
}
