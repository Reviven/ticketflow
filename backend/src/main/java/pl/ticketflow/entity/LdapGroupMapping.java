package pl.ticketflow.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ldap_group_mappings")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LdapGroupMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String adGroupName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole ticketFlowRole;

    private int priority;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
