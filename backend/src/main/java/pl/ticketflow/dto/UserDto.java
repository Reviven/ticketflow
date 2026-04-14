package pl.ticketflow.dto;

import lombok.*;
import pl.ticketflow.entity.UserRole;
import pl.ticketflow.entity.UserSource;
import pl.ticketflow.entity.UserStatus;
import java.time.LocalDateTime;
import java.util.Set;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String department;
    private String jobTitle;
    private UserRole role;
    private UserSource source;
    private UserStatus status;
    private Set<String> ldapGroups;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private String initials;
    private String fullName;
}
