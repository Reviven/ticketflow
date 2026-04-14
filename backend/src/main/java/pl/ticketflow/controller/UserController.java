package pl.ticketflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.ticketflow.dto.UserDto;
import pl.ticketflow.entity.UserSource;
import pl.ticketflow.entity.UserStatus;
import pl.ticketflow.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) UserSource source,
            @RequestParam(required = false) String filter,
            @PageableDefault(size = 20) Pageable pageable) {

        Page<UserDto> users;
        if ("ldap-disabled".equals(filter)) {
            users = userService.getLdapDisabledUsers(pageable);
        } else if (status != null) {
            users = userService.getUsersByStatus(status, pageable);
        } else if (source != null) {
            users = userService.getUsersBySource(source, pageable);
        } else {
            users = userService.getAllUsers(pageable);
        }

        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(id, userDto));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getUserStats() {
        return ResponseEntity.ok(Map.of(
                "total", (long) userService.getAllUsers(Pageable.unpaged()).getTotalElements(),
                "ldap", userService.countLdapUsers(),
                "local", userService.countLocalUsers(),
                "disabled", userService.countDisabledLdapUsers()
        ));
    }
}
