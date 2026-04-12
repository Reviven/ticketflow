package pl.ticketflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.ticketflow.dto.*;
import pl.ticketflow.entity.TicketStatus;

import jakarta.validation.Valid;
import pl.ticketflow.service.TicketService;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<Page<TicketDto>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Long assigneeId,
            @RequestParam(required = false) String filter,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {

        Page<TicketDto> tickets;
        if ("unassigned".equals(filter)) {
            tickets = ticketService.getUnassignedTickets(pageable);
        } else if ("overdue".equals(filter)) {
            tickets = ticketService.getOverdueTickets(pageable);
        } else if (status != null) {
            tickets = ticketService.getTicketsByStatus(status, pageable);
        } else if (assigneeId != null) {
            tickets = ticketService.getTicketsByAssignee(assigneeId, pageable);
        } else {
            tickets = ticketService.getAllTickets(pageable);
        }

        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> getTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @GetMapping("/number/{ticketNumber}")
    public ResponseEntity<TicketDto> getTicketByNumber(@PathVariable String ticketNumber) {
        return ResponseEntity.ok(ticketService.getTicketByNumber(ticketNumber));
    }

    @PostMapping
    public ResponseEntity<TicketDto> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.createTicket(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketDto> updateTicket(
            @PathVariable Long id,
            @RequestBody UpdateTicketRequest request) {
        return ResponseEntity.ok(ticketService.updateTicket(id, request));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.addComment(id, request, authentication.getName()));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getComments(id));
    }
}
