package pl.ticketflow.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.ticketflow.entity.Ticket;
import pl.ticketflow.entity.TicketPriority;
import pl.ticketflow.entity.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketNumber(String ticketNumber);

    Page<Ticket> findByStatus(TicketStatus status, Pageable pageable);
    Page<Ticket> findByPriority(TicketPriority priority, Pageable pageable);
    Page<Ticket> findByRequesterId(Long requesterId, Pageable pageable);
    Page<Ticket> findByAssigneeId(Long assigneeId, Pageable pageable);
    Page<Ticket> findByAssigneeIsNull(Pageable pageable);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = :status")
    long countByStatus(@Param("status") TicketStatus status);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.priority = :priority")
    long countByPriority(@Param("priority") TicketPriority priority);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.createdAt >= :since")
    long countCreatedSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.resolvedAt >= :since")
    long countResolvedSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.dueDate < CURRENT_TIMESTAMP AND t.status NOT IN (pl.ticketflow.entity.TicketStatus.RESOLVED, pl.ticketflow.entity.TicketStatus.CLOSED)")
    long countOverdue();

    @Query("SELECT t FROM Ticket t WHERE t.dueDate < CURRENT_TIMESTAMP AND t.status NOT IN (pl.ticketflow.entity.TicketStatus.RESOLVED, pl.ticketflow.entity.TicketStatus.CLOSED)")
    Page<Ticket> findOverdue(Pageable pageable);

    @Query("SELECT t FROM Ticket t WHERE t.status IN :statuses")
    Page<Ticket> findByStatuses(@Param("statuses") List<TicketStatus> statuses, Pageable pageable);

    @Query(value = "SELECT nextval('ticket_number_seq')", nativeQuery = true)
    Long getNextTicketNumber();
}
