FoodieDash Master Rules (docs/RULES.md)
These rules apply to EVERY phase. Read them first, every time.
1. Scope and workflow
Project folder: D:\AI-ComputerAutomation. Windows + PowerShell. Never touch files outside it.
Do ONLY the phase named in the prompt. Do not start the next phase.
Work in small tasks. After each task: run the relevant check (build/test), update docs/PROGRESS.md, make a git commit.
If you may hit a usage limit, update docs/PROGRESS.md first, then stop. A new chat will resume from it.
Do not ask for confirmation between tasks of the same phase. Stop only for a real external blocker, document it, and continue with unblocked tasks.
At the end of the phase, stop and give a short report (what changed, what was verified, what is BLOCKED).
2. Existing code first
Inspect before changing. Read docs/AUDIT.md.
Do not restart the project, redesign working pages, or create duplicate services, contexts, routes or components.
Do not convert working real-data features back to mock data.
Frontend API calls go through the one central client (see audit). No scattered fetch calls.
3. No fake functionality
Never fake: payments, transaction IDs, OTP, KYC or document verification, bank verification, GPS or driver movement, ratings, reviews, ETA, distance, discounts, restaurant availability, earnings, payouts, order or delivery status.
If the backend cannot support a feature yet, build the backend part or mark it BLOCKED / MISSING in docs/PROGRESS.md.
A button for an unavailable feature must be disabled with a visible "Coming soon" label and a short reason. List every such button in docs/PROGRESS.md.
Mock data may exist only for dev/tests, in a clearly separate place, never active in production flows.
4. Security (always)
Backend is the source of truth. Never trust amounts, roles, user IDs, restaurant IDs, order IDs or statuses sent by the browser.
Identity comes from a verified Firebase ID token on the server (Firebase UID, then FoodieDash user).
Role is read from the backend database by Firebase UID (default CUSTOMER). Never from localStorage, query parameters or the request body. Privileged roles (ADMIN, RESTAURANT_OWNER, DELIVERY_PARTNER) are granted only by approved backend or admin processes.
Check object ownership on every customer, owner and driver endpoint (IDOR protection).
Never log or store: passwords, Firebase tokens, payment secrets, card data, CVV, UPI PIN, OTP, full bank numbers.
Never put secrets in React, Vite env variables, localStorage, or Git.
Validate input on the backend as well as the frontend.
4a. Secrets and files
Do not commit .env, private keys, Firebase Admin credentials, Cashfree or Maps secrets, database passwords.
Use .env.example files with placeholder names only.
If a credential is missing, do NOT invent one. Mark the feature BLOCKED - <what is needed> and continue.
5. Evidence and statuses
Use ONLY these five statuses everywhere (docs, reports, code comments): PASS, FAIL, BLOCKED, NOT TESTED, NOT SUPPORTED
PASS = implemented AND verified.
BLOCKED = cannot be completed/verified because of an external dependency (credentials, approval, provider setup).
NOT TESTED = implemented but not verified.
Never mark PASS because code exists, a page renders, or it compiles.
Every PASS needs evidence recorded in docs/VERIFICATION.md:
Feature:
Status:
Test performed:
Command / API / browser flow:
Expected result:
Actual result:
Evidence: (command output, test result, screenshot path, DB query)
Remaining limitation:

6. Test data
Test accounts and sample data come only from a development/test seed mechanism (Phase 3), documented in docs/TEST_DATA.md.
Seed is dev-only, safe to rerun, never runs in production, never contains real secrets or hard-coded production passwords.
Production runtime must never depend on mockData.ts or demo logins.
7. India defaults (change only if told)
Country India, currency INR (₹), format with Intl.NumberFormat('en-IN'). No $.
Time zone Asia/Kolkata, phone numbers +91.
GST shown on bills where applicable. Launch city: <LAUNCH_CITY> (see 03_CREDENTIALS_AND_DECISIONS.md). No "Manhattan" or "NYC" text anywhere.
Legal text (terms, privacy, refund) is a draft that needs lawyer review. Do not claim legal or regulatory approval.
8. Git and destructive-command safety
Check git status first. Never discard my uncommitted work.
Work on a branch (git checkout -b phase-N-name) and commit after each verified task.
Forbidden without my explicit permission: git reset --hard, git clean -fd, git push --force, rm -rf, Remove-Item -Recurse on project/root folders, DROP DATABASE, DROP SCHEMA, docker system prune, docker volume prune, deleting DB volumes or unknown files.
Database changes use migrations only. No destructive schema recreation.
9. Windows notes
Use PowerShell syntax. Use mvnw.cmd if a Maven wrapper exists, otherwise mvn.
Do not use Linux-only commands (rm, export, && chains that PowerShell 5 rejects). Use ; or separate commands.
Do not start long-running servers without telling me how to stop them.
10. UI quality bar
Every API-driven screen has Loading, Success, Empty, Error (with Retry) states.
Responsive with no horizontal overflow at 320, 360, 375, 390, 412, 430, 768, 1024, 1280, 1440px.
Verify responsiveness by actually rendering in the browser tool and saving screenshots under docs/screenshots/. CSS media queries alone are not proof.
Accessible: labels, keyboard focus, alt text, real buttons (no clickable divs), status not shown by color alone.
Order status wording comes from backend statuses mapped to labels. No separate fake status systems.
11. Money rules (backend only)
Backend calculates subtotal, discount, delivery fee, platform fee, GST, total. Frontend only displays.
Idempotency keys on order creation and payment creation. Duplicate clicks, retries and duplicate webhooks must not create duplicate orders, charges or refunds.
Never show "Paid", "Refunded" or "Payout completed" until the backend has confirmed it.
COD is never marked paid until cash collection is recorded.
12. Security standards (merged from Phase 2 work)
Authentication and identity
Real Firebase ID tokens only, sent as Authorization: Bearer <token>. Never log tokens.
No demo profiles, instant-login shortcuts or fake-token bypasses in production builds. A dev shortcut is allowed only if it is off by default (VITE_ENABLE_DEV_LOGIN=false), needs BOTH VITE_ENABLE_DEV_LOGIN=true AND the backend dev Spring profile, and is stripped from production bundles.
Role source of truth is the backend database (/api/v1/users/me, looked up by Firebase UID). Do not use Firebase custom claims as a second source of truth. If claims are ever used, they only mirror the database value and are never trusted on their own.
Roles are never trusted from localStorage, query parameters, request bodies or custom headers.
Seed data and environments
DataInitializer and any test seeders run ONLY under Spring profiles dev or test (@Profile({"dev","test"})). They never run under prod.
H2 may be used for automated tests only. Production and shared environments use PostgreSQL.
No real secrets or production passwords in source code or sample configs.
Authorization
Default deny: every endpoint requires authentication unless explicitly listed as public.
Public endpoints: restaurant browse, search, public menus, categories, public offers, serviceability check, health checks.
Provider webhooks (for example Cashfree) are public routes but accept requests ONLY after provider signature verification. They never trust a "SUCCESS" value in the body.
Role rules:
CUSTOMER: own cart, profile, addresses, orders, payments. No fleet, delivery, owner or admin APIs.
RESTAURANT_OWNER: own restaurants only (restaurant ownerId must equal the authenticated user). No driver/fleet or admin APIs.
DELIVERY_PARTNER: own assigned deliveries, own availability and location only. No owner or admin APIs.
ADMIN: platform administration, with staff sub-roles enforced on the backend.
Status codes: no token = 401; invalid or expired token = 401; wrong role or not the owner = 403; resource not found or hidden from this user = 404 (avoid leaking that another user's record exists).
Evidence
Evidence goes in docs/VERIFICATION.md using the template in section 5.
Allowed statuses: PASS, FAIL, BLOCKED, NOT TESTED, NOT SUPPORTED.
Never write PASS without an executed test or live verification.
