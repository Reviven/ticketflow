package pl.ticketflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.ticketflow.dto.LdapConfigDto;
import pl.ticketflow.dto.LdapGroupMappingDto;
import pl.ticketflow.service.LdapService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ldap")
@RequiredArgsConstructor
public class LdapController {

    private final LdapService ldapService;

    @GetMapping("/config")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LdapConfigDto> getConfig() {
        return ResponseEntity.ok(ldapService.getConfig());
    }

    @PutMapping("/config")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LdapConfigDto> saveConfig(@RequestBody LdapConfigDto dto) {
        return ResponseEntity.ok(ldapService.saveConfig(dto));
    }

    @PostMapping("/test-connection")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> testConnection() {
        boolean connected = ldapService.testConnection();
        return ResponseEntity.ok(Map.of(
                "connected", connected,
                "message", connected ? "Połączenie z serwerem LDAP nawiązane pomyślnie" : "Nie udało się połączyć z serwerem LDAP"
        ));
    }

    @GetMapping("/group-mappings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LdapGroupMappingDto>> getGroupMappings() {
        return ResponseEntity.ok(ldapService.getGroupMappings());
    }

    @PostMapping("/group-mappings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LdapGroupMappingDto> createGroupMapping(@RequestBody LdapGroupMappingDto dto) {
        return ResponseEntity.ok(ldapService.createGroupMapping(dto));
    }

    @DeleteMapping("/group-mappings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteGroupMapping(@PathVariable Long id) {
        ldapService.deleteGroupMapping(id);
        return ResponseEntity.noContent().build();
    }
}
