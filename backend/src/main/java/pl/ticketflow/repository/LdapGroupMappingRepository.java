package pl.ticketflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.ticketflow.entity.LdapGroupMapping;
import java.util.List;
import java.util.Optional;

public interface LdapGroupMappingRepository extends JpaRepository<LdapGroupMapping, Long> {
    List<LdapGroupMapping> findAllByOrderByPriorityAsc();
    Optional<LdapGroupMapping> findByAdGroupName(String adGroupName);
}
