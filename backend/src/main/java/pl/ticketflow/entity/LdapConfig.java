package pl.ticketflow.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ldap_config")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LdapConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String serverUrl;

    private int port;

    @Builder.Default
    private boolean useSsl = false;

    @Column(nullable = false)
    private String baseDn;

    private String bindDn;

    private String bindPassword;

    private String userSearchBase;

    private String userSearchFilter;

    private String groupSearchBase;

    private String groupSearchFilter;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SearchScope searchScope = SearchScope.SUBTREE;

    @Builder.Default
    private boolean importDisabledAccounts = true;

    // Attribute mapping
    @Builder.Default
    private String attrLogin = "sAMAccountName";
    @Builder.Default
    private String attrFirstName = "givenName";
    @Builder.Default
    private String attrLastName = "sn";
    @Builder.Default
    private String attrEmail = "mail";
    @Builder.Default
    private String attrPhone = "telephoneNumber";
    @Builder.Default
    private String attrDepartment = "department";
    @Builder.Default
    private String attrJobTitle = "title";

    // Sync settings
    @Builder.Default
    private int syncIntervalMinutes = 60;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AdRemovalAction adRemovalAction = AdRemovalAction.DISABLE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuthMethod authMethod = AuthMethod.LDAP_BIND;

    @Builder.Default
    private boolean autoCreateOnLogin = true;

    @Builder.Default
    private boolean sendWelcomeEmail = true;

    @Builder.Default
    private boolean logSyncOperations = false;

    private LocalDateTime lastSyncAt;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum SearchScope {
        SUBTREE, ONE_LEVEL
    }

    public enum AdRemovalAction {
        DISABLE, DELETE, KEEP
    }

    public enum AuthMethod {
        LDAP_BIND, LOCAL_PASSWORD, SSO_KERBEROS
    }
}
