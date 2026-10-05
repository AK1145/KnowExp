# Expense Tracker

A minimal, elegant personal expense-tracking application built with **Spring Boot** and **Angular**.

## Product Philosophy

1. **Record expenses quickly** — frictionless input, autofocus, category grids.
2. **Visualize spending clearly** — interactive donut category breakdowns, monthly trends, and budget progress.
3. **Simple useful insights** — rule-based spending metrics and comparisons without AI fluff.
4. **Native Indian Rupee (₹) formatting** — standard Indian numbering (`₹450`, `₹1,250`, `₹12,500`, `₹1,00,000`).

---

## Architecture Overview

```
expense-tracker/
├── backend/                  # Spring Boot 3.3.4 (Java 17+, Maven)
│   ├── src/main/java/com/expensetracker/
│   │   ├── budget/          # Monthly budget management & calculations
│   │   ├── category/        # Expense categories (Food, Grocery, Beauty, etc.)
│   │   ├── common/          # Global exception handler & IndianNumberFormatter
│   │   ├── config/          # CORS & Jackson BigDecimal serialization
│   │   ├── dashboard/       # Period aggregation (Week, Month, Year)
│   │   ├── expense/         # Core expense CRUD & repository analytics
│   │   └── insight/         # Rule-based insight engine
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/    # Flyway SQL migrations (V1 to V5)
│
└── frontend/                 # Angular 21 (Standalone components, Tailwind CSS)
    └── src/app/
        ├── core/            # Models, services (Signal/RxJS), mock data
        ├── features/        # Dashboard, Add Expense, Transactions, Settings
        ├── layout/          # Responsive Shell, Desktop Sidebar, Mobile Nav
        └── shared/          # Donut Chart, Spending Chart, Budget Summary, etc.
```

---

## Quick Start

### 1. Running the Backend (Spring Boot)

Requirements: Java 17+, PostgreSQL running on `localhost:5432` with database `expense_tracker`.

```bash
cd backend
# Run with Maven Wrapper
./mvnw spring-boot:run
```

The REST API will start on `http://localhost:8080`.
Swagger UI documentation is available at `http://localhost:8080/swagger-ui.html`.

### 2. Running the Frontend (Angular)

Requirements: Node.js 18+

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200` in your browser.

---

## Core Features

- **Dashboard**:
  - Period toggles: **Week**, **Month**, **Year**.
  - Metric summary: Total spending, comparison percentage with previous period.
  - Interactive SVG Donut chart & progress list for category breakdowns.
  - 12-month spending trend bar chart for Yearly view.
  - Budget progress bar with warning indicators (>80% and >100%).
  - Rule-based insights card.
  - Recent transactions list.
- **Add Expense**:
  - Single-screen fast entry with autofocus.
  - Visual category grid selection.
  - Amount, Category, Date, and optional Note.
- **Transactions**:
  - Grouped by date (Today, Yesterday, Date).
  - Real-time search across notes, categories, and amounts.
  - Filter pills by category.
  - In-place Edit modal and Delete actions.
- **Settings & Theming**:
  - Monthly budget limit customization.
  - Dark mode toggle with persistent `localStorage` preference.
