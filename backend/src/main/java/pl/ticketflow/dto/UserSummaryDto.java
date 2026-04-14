package pl.ticketflow.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserSummaryDto {
    private Long id;
    private String username;
    private String fullName;
    private String initials;
    private String email;
    private String department;
}
