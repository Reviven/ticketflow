package pl.ticketflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.ticketflow.entity.LdapConfig;

public interface LdapConfigRepository extends JpaRepository<LdapConfig, Long> {
}
