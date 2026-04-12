package pl.ticketflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ticketflow.dto.LdapConfigDto;
import pl.ticketflow.dto.LdapGroupMappingDto;
import pl.ticketflow.entity.LdapConfig;
import pl.ticketflow.entity.LdapGroupMapping;
import pl.ticketflow.repository.LdapConfigRepository;
import pl.ticketflow.repository.LdapGroupMappingRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LdapService {

    private final LdapConfigRepository ldapConfigRepository;
    private final LdapGroupMappingRepository ldapGroupMappingRepository;

    public LdapConfigDto getConfig() {
        LdapConfig config = ldapConfigRepository.findAll().stream()
                .findFirst()
                .orElse(LdapConfig.builder()
                        .serverUrl("ldap://localhost:389")
                        .baseDn("DC=firma,DC=local")
                        .port(389)
                        .build());
        return toDto(config);
    }

    @Transactional
    public LdapConfigDto saveConfig(LdapConfigDto dto) {
        LdapConfig config = ldapConfigRepository.findAll().stream()
                .findFirst()
                .orElse(new LdapConfig());

        config.setServerUrl(dto.getServerUrl());
        config.setPort(dto.getPort());
        config.setUseSsl(dto.isUseSsl());
        config.setBaseDn(dto.getBaseDn());
        config.setBindDn(dto.getBindDn());
        config.setUserSearchBase(dto.getUserSearchBase());
        config.setUserSearchFilter(dto.getUserSearchFilter());
        config.setGroupSearchBase(dto.getGroupSearchBase());
        config.setGroupSearchFilter(dto.getGroupSearchFilter());
        config.setImportDisabledAccounts(dto.isImportDisabledAccounts());
        config.setAttrLogin(dto.getAttrLogin());
        config.setAttrFirstName(dto.getAttrFirstName());
        config.setAttrLastName(dto.getAttrLastName());
        config.setAttrEmail(dto.getAttrEmail());
        config.setAttrPhone(dto.getAttrPhone());
        config.setAttrDepartment(dto.getAttrDepartment());
        config.setAttrJobTitle(dto.getAttrJobTitle());
        config.setSyncIntervalMinutes(dto.getSyncIntervalMinutes());
        config.setAutoCreateOnLogin(dto.isAutoCreateOnLogin());
        config.setSendWelcomeEmail(dto.isSendWelcomeEmail());
        config.setLogSyncOperations(dto.isLogSyncOperations());

        if (dto.getSearchScope() != null) {
            config.setSearchScope(LdapConfig.SearchScope.valueOf(dto.getSearchScope()));
        }
        if (dto.getAdRemovalAction() != null) {
            config.setAdRemovalAction(LdapConfig.AdRemovalAction.valueOf(dto.getAdRemovalAction()));
        }
        if (dto.getAuthMethod() != null) {
            config.setAuthMethod(LdapConfig.AuthMethod.valueOf(dto.getAuthMethod()));
        }

        return toDto(ldapConfigRepository.save(config));
    }

    public List<LdapGroupMappingDto> getGroupMappings() {
        return ldapGroupMappingRepository.findAllByOrderByPriorityAsc().stream()
                .map(this::toMappingDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LdapGroupMappingDto createGroupMapping(LdapGroupMappingDto dto) {
        LdapGroupMapping mapping = LdapGroupMapping.builder()
                .adGroupName(dto.getAdGroupName())
                .ticketFlowRole(dto.getTicketFlowRole())
                .priority(dto.getPriority())
                .build();
        return toMappingDto(ldapGroupMappingRepository.save(mapping));
    }

    @Transactional
    public void deleteGroupMapping(Long id) {
        ldapGroupMappingRepository.deleteById(id);
    }

    public boolean testConnection() {
        // In a real implementation, this would attempt to connect to the LDAP server
        // For now, return a simulated result
        LdapConfig config = ldapConfigRepository.findAll().stream().findFirst().orElse(null);
        return config != null && config.getServerUrl() != null;
    }

    private LdapConfigDto toDto(LdapConfig config) {
        return LdapConfigDto.builder()
                .id(config.getId())
                .serverUrl(config.getServerUrl())
                .port(config.getPort())
                .useSsl(config.isUseSsl())
                .baseDn(config.getBaseDn())
                .bindDn(config.getBindDn())
                .userSearchBase(config.getUserSearchBase())
                .userSearchFilter(config.getUserSearchFilter())
                .groupSearchBase(config.getGroupSearchBase())
                .groupSearchFilter(config.getGroupSearchFilter())
                .searchScope(config.getSearchScope().name())
                .importDisabledAccounts(config.isImportDisabledAccounts())
                .attrLogin(config.getAttrLogin())
                .attrFirstName(config.getAttrFirstName())
                .attrLastName(config.getAttrLastName())
                .attrEmail(config.getAttrEmail())
                .attrPhone(config.getAttrPhone())
                .attrDepartment(config.getAttrDepartment())
                .attrJobTitle(config.getAttrJobTitle())
                .syncIntervalMinutes(config.getSyncIntervalMinutes())
                .adRemovalAction(config.getAdRemovalAction().name())
                .authMethod(config.getAuthMethod().name())
                .autoCreateOnLogin(config.isAutoCreateOnLogin())
                .sendWelcomeEmail(config.isSendWelcomeEmail())
                .logSyncOperations(config.isLogSyncOperations())
                .lastSyncAt(config.getLastSyncAt() != null ? config.getLastSyncAt().toString() : null)
                .build();
    }

    private LdapGroupMappingDto toMappingDto(LdapGroupMapping mapping) {
        return LdapGroupMappingDto.builder()
                .id(mapping.getId())
                .adGroupName(mapping.getAdGroupName())
                .ticketFlowRole(mapping.getTicketFlowRole())
                .priority(mapping.getPriority())
                .build();
    }
}
