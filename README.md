# ShopNest


A production-style e-commerce platform with a Spring Boot 3 / Java 21 backend and a React 18 / Vite frontend. Includes JWT authentication, role-based access control (Admin / Customer), product catalog with search/filter/sort, cart, wishlist, checkout with simulated payments, order tracking, and an admin dashboard.

> **Important — read before running:** this codebase was generated in a sandboxed environment without access to Maven Central or `npm install`, so it has **not** been compiled or run end-to-end here. Every file was hand-written and statically reviewed (all imports cross-checked against actual file paths, brace/paren balance verified), but you should treat `mvn clean install` and `npm install && npm run dev` as the real first test. Report back anything that doesn't build and it can be fixed quickly — the architecture and logic are complete, but a multi-hundred-file project like this can have a typo that only a real compiler will catch.

---

## 1. Folder Structure

```
ecommerce-platform/
├── ecommerce-backend/          Spring Boot 3 / Java 21 REST API
│   ├── src/main/java/com/ecommerce/platform/
│   │   ├── controller/         REST controllers
│   │   ├── service/            Service interfaces
│   │   ├── service/impl/       Service implementations
│   │   ├── repository/         Spring Data JPA repositories
│   │   ├── entity/              JPA entities (+ entity/enums)
│   │   ├── dto/request/         Request DTOs
│   │   ├── dto/response/        Response DTOs
│   │   ├── security/             JWT, UserDetails, filters
│   │   ├── config/                Security, CORS, Swagger, seed data
│   │   ├── exception/            Custom exceptions + global handler
│   │   ├── mapper/                MapStruct mappers
│   │   ├── payment/               Payment gateway abstraction (mock + pluggable)
│   │   └── util/                  Specifications, security helpers
│   ├── src/main/resources/application.properties
│   └── pom.xml
│
└── ecommerce-frontend/         React 18 + Vite
    └── src/
        ├── api/                  Axios instance + per-resource API modules
        ├── components/           layout, product, cart, common, admin
        ├── context/               Auth, Cart, Toast (Context API)
        ├── pages/                  All customer + admin pages
        └── utils/                  Formatters, route guards
```

---

## 2. Prerequisites

- **Java 21** (JDK)
- **Maven 3.9+**
- **MySQL 8.x** running locally (or reachable)
- **Node.js 18+** and npm

---

## 3. MySQL Setup

1. Make sure MySQL is running locally on port `3306`.
2. The application is configured to **auto-create** the database on first run (`createDatabaseIfNotExist=true` in the JDBC URL), so you don't need to run a `CREATE DATABASE` statement manually — `mvn spring-boot:run` will create `ecommerce_db` automatically using `spring.jpa.hibernate.ddl-auto=update`.
3. If your MySQL username/password differ from the defaults, edit:

   `ecommerce-backend/src/main/resources/application.properties`
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

A reference SQL schema (for documentation / manual setup) is included at `ecommerce-backend/schema-reference.sql` — you do **not** need to run it manually if you let Hibernate auto-create the schema, but it's there if you prefer to provision the database yourself or want to see the table structure at a glance.

---

## 4. Running the Backend

```bash
cd ecommerce-backend
mvn clean install
mvn spring-boot:run
```

The API will start on **http://localhost:8080**.

On first startup, `DataSeeder` automatically creates:
- 1 admin account
- 1 demo customer account
- 6 categories
- 16 sample products across those categories

You can disable seeding by setting `app.seed.enabled=false` in `application.properties`.

### Swagger / API Docs

Once running, visit:
- Swagger UI: **http://localhost:8080/swagger-ui.html**
- OpenAPI JSON: **http://localhost:8080/api-docs**

---

## 5. Running the Frontend

```bash
cd ecommerce-frontend
npm install
npm run dev
```

The app will start on **http://localhost:5173** and is already configured (via `.env`) to call the backend at `http://localhost:8080/api`. Change `VITE_API_BASE_URL` in `.env` if your backend runs elsewhere.

To build for production:
```bash
npm run build
npm run preview
```

---

## 6. Sample Credentials

| Role     | Email                     | Password      |
|----------|----------------------------|---------------|
| Admin    | admin@ecommerce.com        | Admin@123     |
| Customer | customer@ecommerce.com     | Customer@123  |

These are seeded automatically on first backend startup and are also configurable via `application.properties` (`app.seed.admin.*` / `app.seed.customer.*`).

---

## 7. API Testing

- Import the Swagger spec (`http://localhost:8080/api-docs`) into Postman, or browse it directly in Swagger UI.
- Click **Authorize** in Swagger UI and paste a JWT access token (obtained from `POST /api/auth/login`) prefixed with `Bearer ` to test protected endpoints.
- Public endpoints (no auth required): `GET /api/products/**`, `GET /api/categories/**`, `POST /api/auth/**`.
- Admin-only endpoints (require an ADMIN-role JWT): product/category create-update-delete, `/api/admin/**`, `GET /api/users`, `GET /api/orders/all`, order status updates.

Example login request:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.com","password":"Admin@123"}'
```

---

## 8. Payment Simulation

Payments are simulated via a pluggable `PaymentGateway` strategy interface (`com.ecommerce.platform.payment`):

- `MockPaymentGateway` is the active implementation by default (`app.payment.provider=mock` in `application.properties`). It validates that card/UPI fields are present, then simulates a successful charge (no real network call is made, no real card/UPI data is contacted or stored beyond the request).
- **To plug in a real provider later** (e.g. Razorpay or Stripe): implement the `PaymentGateway` interface, annotate it with `@ConditionalOnProperty(name = "app.payment.provider", havingValue = "razorpay")` (or similar), and set `app.payment.provider=razorpay` in `application.properties`. No changes are required anywhere else — `OrderService` depends only on the `PaymentGateway` interface.

---

## 9. Deployment Guide

### Backend → Render

1. Push `ecommerce-backend/` to a GitHub repository (as its own repo, or as a subdirectory — Render supports monorepos via "Root Directory").
2. On [Render](https://render.com), create a **New Web Service**, connect your repo, and set:
   - **Root Directory:** `ecommerce-backend` (if monorepo)
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/ecommerce-backend.jar`
3. Add a managed **MySQL** database on Render (or use an external provider like PlanetScale/Railway), and set these environment variables on the web service:
   - `SPRING_DATASOURCE_URL` → e.g. `jdbc:mysql://<host>:3306/ecommerce_db?useSSL=false&serverTimezone=UTC`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `APP_CORS_ALLOWED_ORIGINS` → your deployed frontend URL (e.g. `https://shopnest.vercel.app`)
   - `APP_JWT_SECRET` → a new, securely generated Base64 secret for production (don't reuse the development default)
4. Deploy. Render will expose your API at a `https://<service-name>.onrender.com` URL.

### Frontend → Vercel

1. Push `ecommerce-frontend/` to GitHub.
2. On [Vercel](https://vercel.com), import the repository, set the **Root Directory** to `ecommerce-frontend`.
3. Vercel auto-detects Vite; confirm Build Command `npm run build` and Output Directory `dist`.
4. Add an environment variable:
   - `VITE_API_BASE_URL` → your deployed backend URL + `/api`, e.g. `https://shopnest-backend.onrender.com/api`
5. Deploy.

### Post-deploy checklist

- Update `app.cors.allowed-origins` (or the `APP_CORS_ALLOWED_ORIGINS` env var) on the backend to include your live Vercel domain — CORS will block requests otherwise.
- Rotate `app.jwt.secret` to a fresh, random Base64 string in production; never reuse the development default.
- Set `app.seed.enabled=false` once you have real data, or change the seeded admin/customer passwords immediately after first deploy.

---

## 10. Notable Design Decisions

- **Layered architecture**: controller → service → repository, with DTOs at every boundary (entities are never returned directly from controllers).
- **Stateless JWT auth** with access + refresh tokens; the frontend Axios instance auto-refreshes on a 401 and replays the original request.
- **Specification-based filtering** (`ProductSpecification`) lets `/api/products` combine category, price range, brand, rating, and stock filters in any combination without exploding the repository with bespoke query methods.
- **Payment gateway abstraction**: `OrderService` never talks to a concrete payment provider — only to the `PaymentGateway` interface — so swapping the mock for Razorpay/Stripe is a single new `@Service` class plus a config flag.
- **No UI framework dependency**: styling is hand-written plain CSS using a small set of design tokens (CSS custom properties) for the white/indigo/blue theme, per the brief.
