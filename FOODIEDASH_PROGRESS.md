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
**Status:** PASS

### What existed before:
- Frontend had customer storefront routes at `/` and admin routes at `/admin/*`.
- Missing frontend routing and layouts for `/restaurant-owner` and `/delivery`.
- `AdminRoute.tsx` and `ProtectedRoute.tsx` were disconnected without unified role-checking logic.
- `AuthContext.tsx` fell back to reading `foodiedash_user_role` from `localStorage` if backend fetch failed, creating an elevation-of-privilege risk via DevTools manipulation.
- `AuthContext.tsx` only had demo access shortcuts for `CUSTOMER` and `ADMIN`, lacking `RESTAURANT_OWNER` and `DELIVERY_PARTNER`.
- `LoginView.tsx` redirected all non-admin users to `/` without routing restaurant owners or delivery partners to their respective portals.
- `backend/user-service` `FirebaseTokenFilter.java` hardcoded `Role.CUSTOMER` for all authenticated principals regardless of database records or token claims.
- `backend/user-service` lacked an admin-restricted endpoint and seeder for role accounts.
- Frontend build failed on 3 unused variable errors (`VerifyOtpView.tsx`, `WishlistView.tsx`).

### What was changed:
1. **Unified Route Protection:** Created `RoleProtectedRoute.tsx` supporting arbitrary role sets, loading spinner prevention of layout flashes, URL-encoded return redirects for unauthenticated sessions, and a comprehensive "Access Restricted" view with current role display, permitted role explanations, portal navigation buttons, and sign-out buttons.
2. **Four Role-Specific Experiences in Routing:**
   - `CUSTOMER`: `/` via `CustomerLayout`
   - `RESTAURANT_OWNER`: `/restaurant-owner` via `RestaurantOwnerLayout` and `RestaurantOwnerDashboardView`
   - `DELIVERY_PARTNER`: `/delivery` via `DeliveryPartnerLayout` and `DeliveryPartnerDashboardView`
   - `ADMIN`: `/admin` via `AdminLayout` and operations views
3. **Backend-Authoritative Role Resolution in AuthContext:**
   - Removed insecure reliance on `localStorage` for role authorization.
   - Guaranteed least-privilege `CUSTOMER` fallback if backend is unreachable during registration.
   - Authoritative role synchronization through backend `userService.getMyProfile()` (`/api/v1/users/me`).
   - Integrated full 4-role demo profiles in `loginWithDemo` (`CUSTOMER`, `RESTAURANT_OWNER`, `DELIVERY_PARTNER`, `ADMIN`).
4. **Post-Authentication Role Routing:**
   - Updated `LoginView.tsx` and `VerifyOtpView.tsx` to redirect authenticated users to their backend role destination (`/admin`, `/restaurant-owner`, `/delivery`, or `/`) or target `redirectUrl`.
   - Added demo fast-login buttons for all 4 roles in `LoginView.tsx`.
   - Added role portal navigation shortcuts in `CustomerNavbar.tsx` user menu.
5. **Backend Security & Authoritative Role Filter:**
   - Refactored `user-service` `FirebaseTokenFilter.java` to inject `UserRepository` and resolve authoritative roles from database records, then custom claims, defaulting to least-privilege `CUSTOMER`.
   - Added `DataInitializer.java` to seed initial accounts for all 4 roles on startup:
     - `dev-admin-alex` (`Role.ADMIN`)
     - `dev-owner-1` (`Role.RESTAURANT_OWNER`)
     - `dev-driver-1` (`Role.DELIVERY_PARTNER`)
     - `demo-customer-sarah` (`Role.CUSTOMER`)
   - Added admin-restricted `GET /api/v1/users` endpoint with `@PreAuthorize("hasRole('ADMIN')")` in `UserController.java`.
   - Added `AccessDeniedException` handling in `GlobalExceptionHandler.java` (HTTP 403 Forbidden).
   - Ensured Firebase ID tokens are never logged.
6. **Codebase Cleanup:**
   - Fixed unused variables in `VerifyOtpView.tsx` and `WishlistView.tsx`.

### Files created:
- `backend/user-service/src/main/java/com/foodiedash/user/config/DataInitializer.java`
- `backend/user-service/src/test/java/com/foodiedash/user/UserControllerSecurityTest.java`
- `src/components/auth/RoleProtectedRoute.tsx`
- `src/components/restaurant/RestaurantOwnerLayout.tsx`
- `src/views/restaurant/RestaurantOwnerDashboardView.tsx`
- `src/components/delivery/DeliveryPartnerLayout.tsx`
- `src/views/delivery/DeliveryPartnerDashboardView.tsx`
- `FOODIEDASH_PROGRESS.md`

### Files modified:
- `backend/user-service/src/main/java/com/foodiedash/user/security/FirebaseTokenFilter.java`
- `backend/user-service/src/main/java/com/foodiedash/user/service/UserService.java`
- `backend/user-service/src/main/java/com/foodiedash/user/service/UserServiceImpl.java`
- `backend/user-service/src/main/java/com/foodiedash/user/controller/UserController.java`
- `backend/user-service/src/main/java/com/foodiedash/user/exception/GlobalExceptionHandler.java`
- `src/context/AuthContext.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/AdminRoute.tsx`
- `src/components/customer/layout/CustomerNavbar.tsx`
- `src/views/customer/LoginView.tsx`
- `src/views/customer/VerifyOtpView.tsx`
- `src/views/customer/WishlistView.tsx`
- `src/App.tsx`

### Authentication architecture:
```
Firebase User
    ↓
Firebase ID Token
    ↓
Authorization: Bearer <token>
    ↓
apiClient interceptor (centralized)
    ↓
API Gateway (port 8080)
    ↓
user-service / microservices (FirebaseTokenFilter)
    ↓
Server-side token verification (FirebaseAuth.verifyIdToken / dev fallback)
    ↓
Firebase UID lookup in UserRepository
    ↓
FoodieDash User Profile entity (PostgreSQL / H2)
    ↓
Backend-authoritative Role (CUSTOMER, RESTAURANT_OWNER, DELIVERY_PARTNER, ADMIN)
    ↓
GrantedAuthority (ROLE_<ROLE>) in SecurityContextHolder
    ↓
Frontend AuthContext (profile.role) & RoleProtectedRoute
```

### Role resolution:
- User role is authoritative from backend `User` entity (`/api/v1/users/me`).
- Default for unauthenticated or first-time registration is least-privilege `CUSTOMER`.
- `localStorage` does NOT authorize or elevate roles.
- Role determines post-login destination:
  - `CUSTOMER` → `/`
  - `RESTAURANT_OWNER` → `/restaurant-owner`
  - `DELIVERY_PARTNER` → `/delivery`
  - `ADMIN` → `/admin`

### Route protection:
- `RoleProtectedRoute` wraps role-specific trees:
  - `/` (public storefront, account pages protected by `ProtectedRoute`)
  - `/admin/*` protected by `RoleProtectedRoute allowedRoles={['ADMIN']}`
  - `/restaurant-owner/*` protected by `RoleProtectedRoute allowedRoles={['RESTAURANT_OWNER']}`
  - `/delivery/*` protected by `RoleProtectedRoute allowedRoles={['DELIVERY_PARTNER']}`
- Unauthenticated access redirects to `/login?redirect=<url>`.
- Unauthorized role renders in-place Access Restricted modal with clear messaging, current role badge, and navigation options.
- Loading state renders full-screen spinner to eliminate unauthorized UI flash.

### Backend authorization:
- Spring Security method security enabled (`@EnableMethodSecurity`).
- Admin endpoints protected with `@PreAuthorize("hasRole('ADMIN')")`.
- Non-admin principals receive HTTP 403 Forbidden with standardized JSON payload.
- Restaurant management operations check owner ID against authenticated UID.
- Missing / invalid token returns HTTP 401 Unauthorized.

### API token handling:
- Centralized in `src/services/apiClient.ts` request interceptor.
- Tokens attached as `Bearer <token>` to all authenticated HTTP requests.
- No ID tokens logged anywhere in frontend or backend logs.

### Tests executed:
- `unauthenticatedRequest_shouldBeDenied`: **PASS** (HTTP 403/401 denied)
- `customerToken_canAccessMyProfile_returnsCustomerRole`: **PASS** (HTTP 200 OK, authoritative role `CUSTOMER`)
- `customerToken_cannotAccessAdminUsersEndpoint_isForbidden`: **PASS** (HTTP 403 Forbidden)
- `restaurantOwnerToken_cannotAccessAdminUsersEndpoint_isForbidden`: **PASS** (HTTP 403 Forbidden)
- `deliveryPartnerToken_cannotAccessAdminUsersEndpoint_isForbidden`: **PASS** (HTTP 403 Forbidden)
- `adminToken_canAccessAdminUsersEndpoint_isOk`: **PASS** (HTTP 200 OK)
- `invalidToken_isDeniedUnauthorized`: **PASS** (HTTP 401 Unauthorized)
- `mvn test -f backend/user-service/pom.xml`: **PASS** (7 tests run, 0 failures, 0 errors)
- `npm run build` (`tsc && vite build`): **PASS** (172 modules compiled, 0 errors)

### Build results:
- Backend `user-service`: `BUILD SUCCESS` (Java 21, Spring Boot 3.3.4)
- Frontend: `✓ built in 3.28s` (Vite v6.4.3, TypeScript 5.7.2)

### Failures:
- None.

### Blocked items:
- Headless browser automated subagent interaction: **BLOCKED — Playwright browser manager failed to install/launch browser driver due to 404 on Azure CDN (`https://playwright.azureedge.net/builds/driver/playwright-1.57.0-win32_x64.zip`)**. (Build, static typecheck, route logic, and backend security tests verified directly).

### Remaining risks:
- Live production Firebase credentials (`google-services.json` / service account key) should be placed in environment variables for non-mock Firebase Admin verification in cloud deployments.

### Exact recommended starting point for STEP 3:
- Proceed to Step 3: Customer Storefront Experience & Restaurant/Menu browsing foundations.
- Do NOT rewrite or modify the role routes or `RoleProtectedRoute` established in Step 2.
- Integrate catalog APIs from `restaurant-service` into the Customer views.
