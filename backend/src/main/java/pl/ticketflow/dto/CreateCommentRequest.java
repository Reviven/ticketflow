package pl.ticketflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CreateCommentRequest {
    @NotBlank(message = "Treść komentarza jest wymagana")
    private String content;
    private boolean internal;
}
