package pl.ticketflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ticketflow.dto.*;
import pl.ticketflow.entity.*;
import pl.ticketflow.repository.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;
    private final UserService userService;

    public Page<TicketDto> getAllTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable).map(this::toDto);
    }

    public Page<TicketDto> getTicketsByStatus(TicketStatus status, Pageable pageable) {
        return ticketRepository.findByStatus(status, pageable).map(this::toDto);
    }

    public Page<TicketDto> getTicketsByAssignee(Long assigneeId, Pageable pageable) {
        return ticketRepository.findByAssigneeId(assigneeId, pageable).map(this::toDto);
    }

    public Page<TicketDto> getUnassignedTickets(Pageable pageable) {
        return ticketRepository.findByAssigneeIsNull(pageable).map(this::toDto);
    }

    public Page<TicketDto> getOverdueTickets(Pageable pageable) {
        return ticketRepository.findOverdue(pageable).map(this::toDto);
    }

    public TicketDto getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono zgłoszenia o ID: " + id));
        return toDetailDto(ticket);
    }

    public TicketDto getTicketByNumber(String ticketNumber) {
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono zgłoszenia: " + ticketNumber));
        return toDetailDto(ticket);
    }

    @Transactional
    public TicketDto createTicket(CreateTicketRequest request, String username) {
        User requester = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika: " + username));

        Long nextNum = ticketRepository.getNextTicketNumber();
        String ticketNumber = "TK-" + nextNum;

        Ticket ticket = Ticket.builder()
                .ticketNumber(ticketNumber)
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .priority(request.getPriority() != null ? request.getPriority() : TicketPriority.MEDIUM)
                .status(TicketStatus.NEW)
                .requester(requester)
                .location(request.getLocation())
                .dueDate(request.getDueDate())
                .cmdbAsset(request.getCmdbAsset())
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono kategorii"));
            ticket.setCategory(category);
            if (category.getSlaMinutes() != null) {
                ticket.setSlaMinutes(category.getSlaMinutes());
            }
        }

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono przypisanego użytkownika"));
            ticket.setAssignee(assignee);
            ticket.setStatus(TicketStatus.OPEN);
        }

        if (request.getTags() != null && !request.getTags().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTags()) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));
                tags.add(tag);
            }
            ticket.setTags(tags);
        }

        return toDto(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketDto updateTicket(Long id, UpdateTicketRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono zgłoszenia o ID: " + id));

        if (request.getTitle() != null) ticket.setTitle(request.getTitle());
        if (request.getDescription() != null) ticket.setDescription(request.getDescription());
        if (request.getPriority() != null) ticket.setPriority(request.getPriority());
        if (request.getLocation() != null) ticket.setLocation(request.getLocation());
        if (request.getDueDate() != null) ticket.setDueDate(request.getDueDate());
        if (request.getCmdbAsset() != null) ticket.setCmdbAsset(request.getCmdbAsset());

        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus());
            if (request.getStatus() == TicketStatus.RESOLVED) {
                ticket.setResolvedAt(LocalDateTime.now());
            } else if (request.getStatus() == TicketStatus.CLOSED) {
                ticket.setClosedAt(LocalDateTime.now());
            }
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono kategorii"));
            ticket.setCategory(category);
        }

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono przypisanego użytkownika"));
            ticket.setAssignee(assignee);
        }

        return toDto(ticketRepository.save(ticket));
    }

    @Transactional
    public CommentDto addComment(Long ticketId, CreateCommentRequest request, String username) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono zgłoszenia o ID: " + ticketId));
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika: " + username));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .ticket(ticket)
                .author(author)
                .internal(request.isInternal())
                .build();

        comment = commentRepository.save(comment);

        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(userService.toSummaryDto(author))
                .internal(comment.isInternal())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    public List<CommentDto> getComments(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(c -> CommentDto.builder()
                        .id(c.getId())
                        .content(c.getContent())
                        .author(userService.toSummaryDto(c.getAuthor()))
                        .internal(c.isInternal())
                        .createdAt(c.getCreatedAt())
                        .updatedAt(c.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public DashboardStats getDashboardStats() {
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return DashboardStats.builder()
                .totalTickets(ticketRepository.count())
                .pendingTickets(ticketRepository.countByStatus(TicketStatus.NEW)
                        + ticketRepository.countByStatus(TicketStatus.OPEN))
                .resolvedTickets(ticketRepository.countByStatus(TicketStatus.RESOLVED))
                .criticalTickets(ticketRepository.countByPriority(TicketPriority.CRITICAL))
                .overdueTickets(ticketRepository.countOverdue())
                .newToday(ticketRepository.countCreatedSince(todayStart))
                .resolvedToday(ticketRepository.countResolvedSince(todayStart))
                .totalUsers(userRepository.count())
                .ldapUsers(userRepository.countLdapUsers())
                .build();
    }

    private TicketDto toDto(Ticket ticket) {
        return TicketDto.builder()
                .id(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .title(ticket.getTitle())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .type(ticket.getType())
                .categoryId(ticket.getCategory() != null ? ticket.getCategory().getId() : null)
                .categoryName(ticket.getCategory() != null ? ticket.getCategory().getFullPath() : null)
                .requester(userService.toSummaryDto(ticket.getRequester()))
                .assignee(userService.toSummaryDto(ticket.getAssignee()))
                .location(ticket.getLocation())
                .dueDate(ticket.getDueDate())
                .slaMinutes(ticket.getSlaMinutes())
                .cmdbAsset(ticket.getCmdbAsset())
                .tags(ticket.getTags().stream().map(Tag::getName).collect(Collectors.toSet()))
                .commentCount((int) commentRepository.countByTicketId(ticket.getId()))
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .closedAt(ticket.getClosedAt())
                .build();
    }

    private TicketDto toDetailDto(Ticket ticket) {
        TicketDto dto = toDto(ticket);
        dto.setDescription(ticket.getDescription());
        dto.setComments(getComments(ticket.getId()));
        return dto;
    }
}
