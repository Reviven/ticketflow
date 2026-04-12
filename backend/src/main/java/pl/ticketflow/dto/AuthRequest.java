package pl.ticketflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}
