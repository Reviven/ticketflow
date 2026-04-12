package pl.ticketflow.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LdapConfigDto {
    private Long id;
    private String serverUrl;
    private int port;
    private boolean useSsl;
    private String baseDn;
    private String bindDn;
    private String userSearchBase;
    private String userSearchFilter;
    private String groupSearchBase;
    private String groupSearchFilter;
    private String searchScope;
    private boolean importDisabledAccounts;
    private String attrLogin;
    private String attrFirstName;
    private String attrLastName;
    private String attrEmail;
    private String attrPhone;
    private String attrDepartment;
    private String attrJobTitle;
    private int syncIntervalMinutes;
    private String adRemovalAction;
    private String authMethod;
    private boolean autoCreateOnLogin;
    private boolean sendWelcomeEmail;
    private boolean logSyncOperations;
    private String lastSyncAt;
}
