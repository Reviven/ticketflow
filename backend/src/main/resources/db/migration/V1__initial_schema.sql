-- TicketFlow Database Schema
-- V1 Initial schema

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(50),
    department VARCHAR(100),
    job_title VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    source VARCHAR(10) NOT NULL DEFAULT 'LOCAL',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    ldap_dn VARCHAR(500),
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_ldap_groups (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, group_name)
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id BIGINT REFERENCES categories(id),
    sla_minutes INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    type VARCHAR(20) NOT NULL DEFAULT 'INCIDENT',
    category_id BIGINT REFERENCES categories(id),
    requester_id BIGINT NOT NULL REFERENCES users(id),
    assignee_id BIGINT REFERENCES users(id),
    location VARCHAR(200),
    due_date TIMESTAMP,
    sla_minutes INT,
    cmdb_asset VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP
);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_id BIGINT NOT NULL REFERENCES users(id),
    internal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE attachments (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    content_type VARCHAR(100),
    file_size BIGINT,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
    uploaded_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_watchers (
    ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (ticket_id, user_id)
);

CREATE TABLE ticket_tags (
    ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (ticket_id, tag_id)
);

CREATE TABLE knowledge_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE knowledge_articles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    category_id BIGINT REFERENCES knowledge_categories(id),
    author_id BIGINT REFERENCES users(id),
    published BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ldap_config (
    id BIGSERIAL PRIMARY KEY,
    server_url VARCHAR(500) NOT NULL,
    port INT NOT NULL DEFAULT 389,
    use_ssl BOOLEAN NOT NULL DEFAULT FALSE,
    base_dn VARCHAR(500) NOT NULL,
    bind_dn VARCHAR(500),
    bind_password VARCHAR(500),
    user_search_base VARCHAR(500),
    user_search_filter VARCHAR(1000),
    group_search_base VARCHAR(500),
    group_search_filter VARCHAR(1000),
    search_scope VARCHAR(20) DEFAULT 'SUBTREE',
    import_disabled_accounts BOOLEAN DEFAULT TRUE,
    attr_login VARCHAR(100) DEFAULT 'sAMAccountName',
    attr_first_name VARCHAR(100) DEFAULT 'givenName',
    attr_last_name VARCHAR(100) DEFAULT 'sn',
    attr_email VARCHAR(100) DEFAULT 'mail',
    attr_phone VARCHAR(100) DEFAULT 'telephoneNumber',
    attr_department VARCHAR(100) DEFAULT 'department',
    attr_job_title VARCHAR(100) DEFAULT 'title',
    sync_interval_minutes INT DEFAULT 60,
    ad_removal_action VARCHAR(20) DEFAULT 'DISABLE',
    auth_method VARCHAR(20) DEFAULT 'LDAP_BIND',
    auto_create_on_login BOOLEAN DEFAULT TRUE,
    send_welcome_email BOOLEAN DEFAULT TRUE,
    log_sync_operations BOOLEAN DEFAULT FALSE,
    last_sync_at TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ldap_group_mappings (
    id BIGSERIAL PRIMARY KEY,
    ad_group_name VARCHAR(255) NOT NULL,
    ticket_flow_role VARCHAR(20) NOT NULL,
    priority INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_requester ON tickets(requester_id);
CREATE INDEX idx_tickets_assignee ON tickets(assignee_id);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX idx_comments_ticket ON comments(ticket_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_source ON users(source);
CREATE INDEX idx_users_status ON users(status);

-- Sequence for ticket numbers
CREATE SEQUENCE ticket_number_seq START WITH 1000 INCREMENT BY 1;
