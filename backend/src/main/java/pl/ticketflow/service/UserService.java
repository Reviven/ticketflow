package pl.ticketflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ticketflow.dto.UserDto;
import pl.ticketflow.dto.UserSummaryDto;
import pl.ticketflow.entity.User;
import pl.ticketflow.entity.UserSource;
import pl.ticketflow.entity.UserStatus;
import pl.ticketflow.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toDto);
    }

    public Page<UserDto> getUsersByStatus(UserStatus status, Pageable pageable) {
        return userRepository.findByStatus(status, pageable).map(this::toDto);
    }

    public Page<UserDto> getUsersBySource(UserSource source, Pageable pageable) {
        return userRepository.findBySource(source, pageable).map(this::toDto);
    }

    public Page<UserDto> getLdapDisabledUsers(Pageable pageable) {
        return userRepository.findBySourceAndStatus(UserSource.LDAP, UserStatus.DISABLED, pageable).map(this::toDto);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika o ID: " + id));
        return toDto(user);
    }

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika: " + username));
        return toDto(user);
    }

    @Transactional
    public UserDto createUser(UserDto userDto, String password) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new RuntimeException("Nazwa użytkownika jest już zajęta: " + userDto.getUsername());
        }
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email jest już zajęty: " + userDto.getEmail());
        }

        User user = User.builder()
                .username(userDto.getUsername())
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(password))
                .phone(userDto.getPhone())
                .department(userDto.getDepartment())
                .jobTitle(userDto.getJobTitle())
                .role(userDto.getRole())
                .source(UserSource.LOCAL)
                .status(UserStatus.ACTIVE)
                .build();

        return toDto(userRepository.save(user));
    }

    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika o ID: " + id));

        if (userDto.getFirstName() != null) user.setFirstName(userDto.getFirstName());
        if (userDto.getLastName() != null) user.setLastName(userDto.getLastName());
        if (userDto.getEmail() != null) user.setEmail(userDto.getEmail());
        if (userDto.getPhone() != null) user.setPhone(userDto.getPhone());
        if (userDto.getDepartment() != null) user.setDepartment(userDto.getDepartment());
        if (userDto.getJobTitle() != null) user.setJobTitle(userDto.getJobTitle());
        if (userDto.getRole() != null) user.setRole(userDto.getRole());
        if (userDto.getStatus() != null) user.setStatus(userDto.getStatus());

        return toDto(userRepository.save(user));
    }

    public long countLdapUsers() {
        return userRepository.countLdapUsers();
    }

    public long countLocalUsers() {
        return userRepository.countLocalUsers();
    }

    public long countDisabledLdapUsers() {
        return userRepository.countDisabledLdapUsers();
    }

    public UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .department(user.getDepartment())
                .jobTitle(user.getJobTitle())
                .role(user.getRole())
                .source(user.getSource())
                .status(user.getStatus())
                .ldapGroups(user.getLdapGroups())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .initials(user.getInitials())
                .fullName(user.getFullName())
                .build();
    }

    public UserSummaryDto toSummaryDto(User user) {
        if (user == null) return null;
        return UserSummaryDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .initials(user.getInitials())
                .email(user.getEmail())
                .department(user.getDepartment())
                .build();
    }
}
