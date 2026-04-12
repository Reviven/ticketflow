package pl.ticketflow.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.ticketflow.entity.User;
import pl.ticketflow.entity.UserRole;
import pl.ticketflow.entity.UserSource;
import pl.ticketflow.entity.UserStatus;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    Page<User> findByStatus(UserStatus status, Pageable pageable);
    Page<User> findBySource(UserSource source, Pageable pageable);
    Page<User> findByRole(UserRole role, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.source = :source AND u.status = :status")
    Page<User> findBySourceAndStatus(@Param("source") UserSource source, @Param("status") UserStatus status, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.source = 'LDAP'")
    long countLdapUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.source = 'LDAP' AND u.status = 'DISABLED'")
    long countDisabledLdapUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.source = 'LOCAL'")
    long countLocalUsers();

    Optional<User> findByLdapDn(String ldapDn);
}
