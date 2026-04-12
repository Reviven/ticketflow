-- V2: Seed data for initial setup

-- Default admin user (password: admin123)
INSERT INTO users (username, first_name, last_name, email, password, role, source, status)
VALUES ('admin', 'Admin', 'System', 'admin@ticketflow.local',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'ADMIN', 'LOCAL', 'ACTIVE');

-- Default categories
INSERT INTO categories (name, description, sla_minutes) VALUES
('Sprzęt', 'Problemy ze sprzętem komputerowym', 480),
('Oprogramowanie', 'Problemy z oprogramowaniem', 240),
('Sieć', 'Problemy z siecią i infrastrukturą', 120),
('Konta / Dostęp', 'Zarządzanie kontami i uprawnieniami', 240);

INSERT INTO categories (name, description, parent_id, sla_minutes) VALUES
('Drukarki', 'Problemy z drukarkami', 1, 480),
('Komputery', 'Problemy z komputerami', 1, 480),
('Monitory', 'Problemy z monitorami', 1, 960),
('ERP', 'Systemy ERP (SAP, etc.)', 2, 240),
('Office', 'Pakiet Office / Microsoft 365', 2, 480),
('Serwery', 'Problemy z serwerami', 3, 60),
('WiFi', 'Problemy z siecią bezprzewodową', 3, 120),
('VPN', 'Dostęp VPN', 4, 240),
('Email', 'Poczta elektroniczna', 4, 240);

-- Default tags
INSERT INTO tags (name, color) VALUES
('pilne', '#ef4444'),
('hardware', '#3b82f6'),
('software', '#10b981'),
('sieć', '#f59e0b'),
('bezpieczeństwo', '#8b5cf6'),
('onboarding', '#ec4899');

-- Knowledge base categories
INSERT INTO knowledge_categories (name, description, icon, color) VALUES
('Sprzęt komputerowy', 'Procedury obsługi i rozwiązywania problemów ze sprzętem', 'fa-laptop', '#3b82f6'),
('Oprogramowanie', 'Instalacja, konfiguracja i rozwiązywanie problemów z aplikacjami', 'fa-code', '#10b981'),
('Sieć i infrastruktura', 'Diagnostyka sieci, VPN, konfiguracja routerów', 'fa-network-wired', '#f59e0b'),
('Bezpieczeństwo IT', 'Polityki bezpieczeństwa, reagowanie na incydenty', 'fa-shield-alt', '#ef4444'),
('Konta i uprawnienia', 'Tworzenie kont, zarządzanie uprawnieniami AD', 'fa-user-shield', '#4f46e5'),
('Onboarding / Offboarding', 'Procedury wdrażania nowych pracowników', 'fa-graduation-cap', '#ec4899');

-- Default LDAP group mappings
INSERT INTO ldap_group_mappings (ad_group_name, ticket_flow_role, priority) VALUES
('IT-Admins', 'ADMIN', 1),
('IT-HelpDesk', 'TECHNICIAN', 2),
('Management', 'OBSERVER', 3);
