package pl.ticketflow.dto;

import lombok.*;
import pl.ticketflow.entity.UserRole;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LdapGroupMappingDto {
    private Long id;
    private String adGroupName;
    private UserRole ticketFlowRole;
    private int priority;
}
