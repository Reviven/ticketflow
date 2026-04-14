package pl.ticketflow.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStats {
    private long totalTickets;
    private long pendingTickets;
    private long resolvedTickets;
    private long criticalTickets;
    private long overdueTickets;
    private long newToday;
    private long resolvedToday;
    private long totalUsers;
    private long ldapUsers;
}
