# 🏦 Banking App — Spring Boot REST API

A full-featured **RESTful Banking Application** built with **Spring Boot 3**, **Spring Data JPA**, **MySQL**, and **Lombok**. It exposes a clean REST API for managing bank accounts — including creating accounts, viewing account details, depositing funds, and withdrawing funds.

---

## 📁 Project Structure

```
banking-app/
├── .mvn/                                          # Maven wrapper configuration
├── src/
│   ├── main/
│   │   ├── java/com/example/banking/
│   │   │   ├── BankingAppApplication.java         # Spring Boot entry point (@SpringBootApplication)
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── AccountController.java         # REST controller — maps all /api/accounts/* routes
│   │   │   │   └── RquestMapping.java             # Custom annotation (placeholder/utility)
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   └── AccountDto.java                # Data Transfer Object — used for request/response payloads
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   └── Account.java                   # JPA Entity — mapped to `accounts` table in MySQL
│   │   │   │
│   │   │   ├── mapper/
│   │   │   │   └── AccountMapper.java             # Utility class — converts between Account ↔ AccountDto
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   └── AccountRepository.java         # Spring Data JPA Repository — CRUD operations on Account
│   │   │   │
│   │   │   └── service/
│   │   │       ├── AccountService.java            # Service interface — defines business logic contract
│   │   │       └── impl/
│   │   │           └── AccountServiceImpl.java    # Service implementation — contains business logic
│   │   │
│   │   └── resources/
│   │       ├── application.properties             # App configuration (DB URL, credentials, JPA settings)
│   │       ├── static/                            # Static assets (HTML/CSS/JS) — served directly
│   │       └── templates/                         # Thymeleaf templates (if used)
│   │
│   └── test/
│       └── java/                                  # Unit / Integration tests
│
├── pom.xml                                        # Maven build descriptor — dependencies & plugins
├── mvnw / mvnw.cmd                                # Maven wrapper scripts (Linux / Windows)
├── HELP.md                                        # Spring Initializr generated help docs
├── .gitignore                                     # Git ignore rules
└── .gitattributes                                 # Git line-ending configuration
```

---

## 🧱 Architecture Overview

This project follows a classic **Layered (N-Tier) Architecture**:

```
┌──────────────────────────────┐
│       REST Client / UI        │  ← Postman, Browser, Frontend
└─────────────┬────────────────┘
              │ HTTP Requests
┌─────────────▼────────────────┐
│    Controller Layer           │  AccountController.java
│    @RestController            │  Handles HTTP, returns JSON
└─────────────┬────────────────┘
              │ Uses DTO
┌─────────────▼────────────────┐
│    Service Layer              │  AccountService (interface)
│    @Service                   │  AccountServiceImpl (logic)
└─────────────┬────────────────┘
              │ Uses Entity + Mapper
┌─────────────▼────────────────┐
│    Repository Layer           │  AccountRepository
│    Spring Data JPA            │  Extends JpaRepository<Account, Long>
└─────────────┬────────────────┘
              │
┌─────────────▼────────────────┐
│    Database (MySQL)           │  banking_app → accounts table
└──────────────────────────────┘
```

### Key Design Patterns
| Pattern | Usage |
|---|---|
| **DTO Pattern** | `AccountDto` decouples API contract from DB entity |
| **Repository Pattern** | `AccountRepository` abstracts all DB operations |
| **Service Layer Pattern** | `AccountService` interface + `AccountServiceImpl` for clean separation |
| **Mapper Pattern** | `AccountMapper` converts Entity ↔ DTO without external library overhead |
| **Constructor Injection** | Dependencies injected via constructors (Spring best practice) |

---

## 🗃️ Database Schema

**Database:** `banking_app` (MySQL)

**Table:** `accounts`

| Column | Type | Constraints |
|---|---|---|
| `id` | `BIGINT` | PRIMARY KEY, AUTO_INCREMENT |
| `account_holder_name` | `VARCHAR(255)` | NOT NULL |
| `balance` | `DOUBLE` | NOT NULL |

> The schema is auto-managed by Hibernate with `spring.jpa.hibernate.ddl-auto=update`.

---

## ⚙️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Java** | 17 | Core language |
| **Spring Boot** | 3.5.7 | Application framework |
| **Spring Web** | — | REST API layer (`@RestController`) |
| **Spring Data JPA** | — | Database ORM layer |
| **Hibernate** | — | JPA implementation |
| **MySQL** | — | Relational database |
| **Lombok** | — | Boilerplate reduction (`@Getter`, `@Setter`, `@Data`, etc.) |
| **Maven** | — | Build & dependency management |

---

## 🔌 REST API Reference

Base URL: `http://localhost:8080/api/accounts`

### 1. Create Account
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/accounts` |
| **Request Body** | JSON |
| **Response** | `201 Created` + AccountDto JSON |

**Request Body:**
```json
{
  "accountHolderName": "Ayush Sharma",
  "balance": 5000.00
}
```

**Response:**
```json
{
  "id": 1,
  "accountHolderName": "Ayush Sharma",
  "balance": 5000.00
}
```

---

### 2. Get Account by ID
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/accounts/{id}` |
| **Response** | `200 OK` + AccountDto JSON |

**Response:**
```json
{
  "id": 1,
  "accountHolderName": "Ayush Sharma",
  "balance": 5000.00
}
```

---

### 3. Get All Accounts
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/accounts/getAll` |
| **Response** | `200 OK` + Array of AccountDto |

**Response:**
```json
[
  {
    "id": 1,
    "accountHolderName": "Ayush Sharma",
    "balance": 5000.00
  },
  {
    "id": 2,
    "accountHolderName": "Riya Patel",
    "balance": 12000.00
  }
]
```

---

### 4. Deposit Funds
| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/accounts/{id}/deposit` |
| **Request Body** | JSON |
| **Response** | `200 OK` + updated AccountDto |

**Request Body:**
```json
{
  "ammount": 2500.00
}
```

> ⚠️ Note: The key is `ammount` (typo preserved from source code — match exactly).

**Response:**
```json
{
  "id": 1,
  "accountHolderName": "Ayush Sharma",
  "balance": 7500.00
}
```

---

### 5. Withdraw Funds
| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/accounts/{id}/withdraw` |
| **Request Body** | JSON |
| **Response** | `200 OK` + updated AccountDto |

**Request Body:**
```json
{
  "ammount": 1000.00
}
```

> ⚠️ Note: The key is `ammount` (typo preserved from source code — match exactly).  
> ⚠️ Throws `RuntimeException("Insufficient balance")` if balance < amount.

**Response:**
```json
{
  "id": 1,
  "accountHolderName": "Ayush Sharma",
  "balance": 6500.00
}
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** installed
- **MySQL 8+** running locally
- **Maven 3.8+** (or use included `mvnw`)
- **Git**

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/banking-app.git
cd banking-app
```

---

### Step 2: Set Up MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE banking_app;
```

---

### Step 3: Configure Database Credentials

Edit `src/main/resources/application.properties`:

```properties
spring.application.name=banking-app
spring.datasource.url=jdbc:mysql://localhost:3306/banking_app
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
spring.jpa.hibernate.ddl-auto=update
```

---

### Step 4: Run the Application

**Using Maven Wrapper (recommended):**

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

**Using Maven directly:**
```bash
mvn spring-boot:run
```

The server will start at: **`http://localhost:8080`**

---

### Step 5: Test the API

You can test using **Postman**, **curl**, or the included **Frontend UI**.

**Quick curl test — Create account:**
```bash
curl -X POST http://localhost:8080/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"accountHolderName":"Ayush","balance":5000}'
```

**Get all accounts:**
```bash
curl http://localhost:8080/api/accounts/getAll
```

---

## 🧩 Component Deep Dive

### `BankingAppApplication.java`
Entry point annotated with `@SpringBootApplication`. Bootstraps the entire Spring context.

### `AccountController.java`
REST controller mapped to `/api/accounts`. Delegates all business logic to `AccountService`.
- Uses `@PostMapping`, `@GetMapping`, `@PutMapping`
- Returns `ResponseEntity<AccountDto>` for proper HTTP status codes

### `AccountDto.java`
Data Transfer Object using Lombok's `@Data` and `@AllArgsConstructor`. Fields:
- `id` (Long), `accountHolderName` (String), `balance` (double)

### `Account.java` (Entity)
JPA entity mapped to `accounts` table. Uses Lombok annotations for getters/setters. Columns:
- `id` — auto-generated primary key
- `account_holder_name` — mapped with `@Column`
- `balance` — double value

### `AccountRepository.java`
Extends `JpaRepository<Account, Long>` — provides CRUD methods out of the box (`save`, `findById`, `findAll`, etc.)

### `AccountMapper.java`
Static utility class with two methods:
- `mapToAccount(AccountDto)` → `Account`
- `mapToAccountDto(Account)` → `AccountDto`

### `AccountService.java`
Interface defining the service contract:
- `creatAccount(AccountDto)` — note typo preserved
- `getAcountById(Long)` — note typo preserved
- `deposit(Long, double)`
- `withdraw(Long, double)`
- `getAllAccounts()`

### `AccountServiceImpl.java`
Implementation of `AccountService`. Contains all business logic:
- Creates accounts via repository
- Validates sufficient balance before withdrawal
- Throws `RuntimeException` for not-found / insufficient-balance scenarios

---

## 🛠️ Running Tests

```bash
./mvnw test
```

---

## 📦 Build for Production

```bash
./mvnw clean package
java -jar target/banking-app-0.0.1-SNAPSHOT.jar
```

---

## 🔒 Security Notes

> This is a **demo/learning project**. For production use, consider adding:
> - Spring Security (JWT / OAuth2 authentication)
> - Input validation with `@Valid` and `jakarta.validation`
> - Global exception handling with `@ControllerAdvice`
> - HTTPS / TLS configuration
> - Rate limiting
> - Secure password storage for DB credentials (environment variables / secrets manager)

---

## 📄 License

This project is for educational purposes. Feel free to fork and extend it.

---

## 👤 Author

**Ayush** — Spring Boot Banking Application Demo  
Built with ❤️ using Spring Boot 3 + MySQL + Lombok
