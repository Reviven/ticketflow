# TicketFlow — System Zarządzania Zgłoszeniami

Aplikacja webowa do zarządzania zgłoszeniami IT, inspirowana systemami GLPI / Jira / Zammad.

## Technologie

| Warstwa     | Technologia                          |
|-------------|--------------------------------------|
| Backend     | Java 21, Spring Boot 3.2.5           |
| Baza danych | PostgreSQL 16                        |
| Frontend    | React 18, TypeScript, Vite           |
| Auth        | JWT (JSON Web Token)                 |
| LDAP        | Spring LDAP / Active Directory       |
| Migracje    | Flyway                               |
| Konteneryzacja | Docker, Docker Compose            |

## Funkcje

- **Dashboard** — przegląd statystyk, ostatnie zgłoszenia, wykresy
- **Zarządzanie zgłoszeniami** — CRUD, komentarze, statusy, priorytety, tagi, SLA
- **Integracja LDAP/AD** — synchronizacja użytkowników z Active Directory, mapowanie grup na role
- **Baza wiedzy** — artykuły pogrupowane w kategorie
- **Zarządzanie użytkownikami** — role (Admin, Technik, Użytkownik, Obserwator), filtrowanie
- **Konfiguracja LDAP** — pełna konfiguracja połączenia, mapowania atrybutów, harmonogramu synchronizacji

## Szybki start (Docker Compose)

```bash
# Klonowanie repozytorium
git clone <url-repozytorium>
cd ticketflow

# Uruchomienie wszystkich usług
docker compose up -d

# Aplikacja dostępna pod:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
```

### Domyślne konto administratora

| Login   | Hasło     |
|---------|-----------|
| `admin` | `admin123`|

## Uruchomienie lokalne (development)

### Wymagania
- Java 21 (JDK)
- Node.js 18+
- PostgreSQL 16
- Maven 3.9+

### 1. Baza danych

```bash
# Utwórz bazę danych
createdb ticketflow

# Lub przez Docker:
docker run -d --name ticketflow-db \
  -e POSTGRES_DB=ticketflow \
  -e POSTGRES_USER=ticketflow \
  -e POSTGRES_PASSWORD=ticketflow123 \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Backend

```bash
cd backend

# Kompilacja i uruchomienie
mvn spring-boot:run \
  -Dspring-boot.run.arguments="--spring.datasource.url=jdbc:postgresql://localhost:5432/ticketflow --spring.datasource.username=ticketflow --spring.datasource.password=ticketflow123"
```

Backend uruchomi się na `http://localhost:8080/api`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend uruchomi się na `http://localhost:5173` z proxy do backendu.

## API Endpoints

### Autentykacja
| Metoda | Endpoint        | Opis              |
|--------|-----------------|--------------------|
| POST   | `/api/auth/login` | Logowanie (JWT)  |
| GET    | `/api/auth/me`    | Aktualny użytkownik |

### Zgłoszenia
| Metoda | Endpoint                     | Opis                    |
|--------|------------------------------|--------------------------|
| GET    | `/api/tickets`               | Lista zgłoszeń (paginacja) |
| GET    | `/api/tickets/{id}`          | Szczegóły zgłoszenia     |
| POST   | `/api/tickets`               | Utwórz zgłoszenie        |
| PUT    | `/api/tickets/{id}`          | Aktualizuj zgłoszenie    |
| POST   | `/api/tickets/{id}/comments` | Dodaj komentarz          |

### Użytkownicy
| Metoda | Endpoint           | Opis                |
|--------|--------------------|----------------------|
| GET    | `/api/users`       | Lista użytkowników   |
| GET    | `/api/users/{id}`  | Szczegóły użytkownika|
| PUT    | `/api/users/{id}`  | Aktualizuj (ADMIN)   |
| GET    | `/api/users/stats` | Statystyki           |

### LDAP
| Metoda | Endpoint                      | Opis                    |
|--------|-------------------------------|--------------------------|
| GET    | `/api/ldap/config`            | Konfiguracja LDAP        |
| PUT    | `/api/ldap/config`            | Zapisz konfigurację      |
| POST   | `/api/ldap/test-connection`   | Testuj połączenie        |
| GET    | `/api/ldap/group-mappings`    | Mapowania grup           |
| POST   | `/api/ldap/group-mappings`    | Dodaj mapowanie          |

### Dashboard
| Metoda | Endpoint              | Opis              |
|--------|-----------------------|--------------------|
| GET    | `/api/dashboard/stats`| Statystyki systemu |

### Baza wiedzy
| Metoda | Endpoint                     | Opis              |
|--------|------------------------------|--------------------|
| GET    | `/api/knowledge/categories`  | Kategorie          |
| GET    | `/api/knowledge/articles`    | Lista artykułów    |
| POST   | `/api/knowledge/articles`    | Utwórz artykuł     |

## Struktura projektu

```
ticketflow/
├── backend/                    # Spring Boot API
│   ├── src/main/java/pl/ticketflow/
│   │   ├── config/            # Konfiguracja (Security, CORS)
│   │   ├── controller/        # REST kontrolery
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── entity/            # Encje JPA
│   │   ├── repository/        # Spring Data JPA repozytoria
│   │   ├── security/          # JWT, filtry, UserDetails
│   │   └── service/           # Logika biznesowa
│   ├── src/main/resources/
│   │   ├── application.yml    # Konfiguracja Spring Boot
│   │   └── db/migration/      # Flyway migracje SQL
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React + TypeScript
│   ├── src/
│   │   ├── components/        # Komponenty UI (Layout)
│   │   ├── context/           # React Context (Auth)
│   │   ├── pages/             # Strony (Dashboard, Tickets, etc.)
│   │   ├── services/          # Klient API (axios)
│   │   └── types/             # TypeScript typy
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Role użytkowników

| Rola       | Uprawnienia                                           |
|------------|-------------------------------------------------------|
| ADMIN      | Pełny dostęp, konfiguracja LDAP, zarządzanie użytkownikami |
| TECHNICIAN | Obsługa zgłoszeń, komentarze, zmiana statusu          |
| USER       | Tworzenie zgłoszeń, podgląd własnych                  |
| OBSERVER   | Podgląd zgłoszeń (tylko odczyt)                       |

## Zmienne środowiskowe

| Zmienna                      | Domyślnie                | Opis                    |
|------------------------------|--------------------------|--------------------------|
| `SPRING_DATASOURCE_URL`     | `jdbc:postgresql://localhost:5432/ticketflow` | URL bazy danych |
| `SPRING_DATASOURCE_USERNAME`| `postgres`               | Użytkownik DB            |
| `SPRING_DATASOURCE_PASSWORD`| `postgres`               | Hasło DB                 |
| `JWT_SECRET`                | (wymagany)               | Klucz JWT (min 32 znaki) |
| `JWT_EXPIRATION`            | `86400000`               | Ważność tokena (ms)      |
| `SERVER_PORT`               | `8080`                   | Port serwera             |

## Licencja

MIT
