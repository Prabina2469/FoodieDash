# FoodieDash — Master Implementation & Progress Tracker

---

## Step 1: Environment & Implementation Baseline Audit
**Status:** PASS

### 1. Environment & Tooling
- **Node.js:** v24.21.0
- **npm:** 11.19.0
- **Java / JDK:** OpenJDK 21.0.12.1 (Temurin 64-Bit Server VM)
- **Maven:** Apache Maven 3.10.0 (D:\apache-maven-3.10.0)
- **Vite:** 6.4.3
- **TypeScript:** 5.7.2
- **Spring Boot:** 3.3.4 (Java 21, Spring Cloud 2023.0.3)

### 2. Architecture Discovery
- Single platform supporting four target role-specific experiences:
  - `CUSTOMER` (`/`)
  - `RESTAURANT_OWNER` (`/restaurant-owner`)
  - `DELIVERY_PARTNER` (`/delivery`)
  - `ADMIN` (`/admin`)
- Microservices portfolio in `backend/`:
  - `api-gateway` (Spring Cloud Gateway, port 8080)
  - `user-service` (User profiles & auth token resolution, port 8081)
  - `restaurant-service` (Catalogs & menus, port 8082)
  - `cart-service` (Cart operations, port 8083)
  - `order-service` (Orders & checkout, port 8084)
  - `payment-service` (Payment integrations, port 8085)
  - `notification-service` (Webhooks & notifications, port 8086)
  - `fleet-service` (Live delivery tracking & drivers, port 8087)
  - `ai-service` (Recommendations & analytics, port 8088)
  - `eureka-server` (Discovery registry, port 8761)

---

## STEP 2 — PLATFORM ARCHITECTURE + ROLE FOUNDATION
**Status:** PARTIAL

### Phase 2 Fix-up Objectives:
1. REMOVE demo/instant-login profiles from AuthContext and LoginView, and fake-token paths. Real Firebase authentication only. Dev shortcut off by default (`VITE_ENABLE_DEV_LOGIN=true` + dev profile).
2. DataInitializer: run only under Spring profiles "dev" or "test", never in production. No hardcoded real secrets. Prove exclusion on "prod".
3. Authorization coverage: document every endpoint of every service in `docs/VERIFICATION.md` with path, public/authenticated, allowed roles. Default deny. Enforce Firebase token filter and role rules across services + ownership checks.
4. HTTP Status Codes: Unauthenticated requests return 401, invalid/expired token 401, wrong role 403.
5. Add tests: Customer -> Delivery API 403, Driver -> Owner API 403, role spoof ignored, expired token 401. Real Firebase verification path test / emulator.
6. Browser verification: Playwright via CDN download host or IDE built-in browser.
7. Merge FOODIEDASH_PROGRESS.md into docs/PROGRESS.md and keep one file. Create docs/VERIFICATION.md with evidence.
8. Report status of login methods and gateway rate limiting roadmap.

---
