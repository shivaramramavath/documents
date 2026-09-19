# Scalable Feature-Based Architecture — React + Node.js Backend

> **Core principle:** Components handle UI. Hooks handle React behavior. Services handle API communication. Stores handle client state. Features own business-specific code. Backend modules own business logic, persistence, and infrastructure.

This document extends the feature-based React structure into a scalable **full-stack architecture** with a clear frontend/backend boundary.

---

# 1. Full Project Structure

For a serious application, keep frontend and backend independently scalable:

```text
project/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── shared/
│   │   └── assets/
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── app/
│   │   ├── config/
│   │   ├── modules/
│   │   ├── middleware/
│   │   ├── infrastructure/
│   │   ├── shared/
│   │   ├── routes/
│   │   └── server.ts
│   │
│   └── package.json
│
├── packages/
│   ├── types/
│   └── config/
│
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md
```

For a smaller project, `packages/` can be omitted.

---

# 2. Frontend Architecture

```text
client/src/

├── app/
│   ├── providers/
│   ├── router/
│   ├── config/
│   ├── App.tsx
│   └── main.tsx
│
├── features/
│   ├── auth/
│   ├── users/
│   ├── dashboard/
│   └── payments/
│
├── pages/
│
├── layouts/
│
├── shared/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── helpers/
│   ├── constants/
│   ├── lib/
│   ├── types/
│   └── validation/
│
└── assets/
```

The main boundary is:

```text
app
 ↓
pages
 ↓
features
 ↓
shared
```

Feature code should not become a dumping ground for unrelated application infrastructure.

---

# 3. Backend Architecture

A scalable Node.js backend can use **feature/module-based organization**:

```text
server/src/

├── app/
│   ├── app.ts
│   ├── routes.ts
│   └── providers.ts
│
├── config/
│   ├── env.ts
│   ├── logger.ts
│   ├── database.ts
│   └── redis.ts
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── payments/
│   └── notifications/
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── rate-limit.middleware.ts
│   └── request-id.middleware.ts
│
├── infrastructure/
│   ├── database/
│   ├── cache/
│   ├── queue/
│   ├── mail/
│   ├── storage/
│   └── observability/
│
├── shared/
│   ├── errors/
│   ├── types/
│   ├── constants/
│   ├── utils/
│   └── validators/
│
├── routes/
│   └── index.ts
│
└── server.ts
```

For larger systems, prefer putting most business-specific backend code inside `modules/`.

---

# 4. Backend Module Structure

Each business module can own its complete functionality.

Example:

```text
modules/auth/

├── auth.routes.ts
├── auth.controller.ts
├── auth.service.ts
├── auth.repository.ts
├── auth.schema.ts
├── auth.types.ts
├── auth.mapper.ts
├── strategies/
│   ├── local.strategy.ts
│   ├── jwt.strategy.ts
│   └── google.strategy.ts
└── index.ts
```

Another module:

```text
modules/users/

├── user.routes.ts
├── user.controller.ts
├── user.service.ts
├── user.repository.ts
├── user.model.ts
├── user.schema.ts
├── user.types.ts
├── user.mapper.ts
└── index.ts
```

This keeps business logic close to the business domain.

---

# 5. Backend Responsibility Rules

## Routes

Routes define HTTP endpoints.

```ts
router.post(
  "/login",
  validate(loginSchema),
  login
);
```

Routes should not contain database logic.

---

## Controllers

Controllers handle HTTP concerns:

- Request
- Response
- Status codes
- Request parameters
- Calling services

Example:

```ts
export const login = async (
  req,
  res,
  next
) => {
  try {
    const result = await authService.login(
      req.body
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
```

---

## Services

Services contain business logic.

```ts
export const login = async ({
  email,
  password,
}) => {
  const user = await userRepository.findByEmail(
    email
  );

  // Authentication/business rules...

  return {
    user,
    accessToken,
  };
};
```

A service should not depend on Express `req`/`res` when avoidable.

---

## Repositories

Repositories handle persistence.

```ts
export const findByEmail = (email: string) => {
  return User.findOne({ email });
};
```

This keeps database access out of controllers.

---

# 6. Backend Data Flow

Recommended:

```text
HTTP Request
     ↓
Middleware
     ↓
Route
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Database
```

Response:

```text
Database
   ↓
Repository
   ↓
Service
   ↓
Mapper
   ↓
Controller
   ↓
HTTP Response
```

---

# 7. Frontend Data Flow

Recommended:

```text
Page
 ↓
Feature Component
 ↓
Feature Hook
 ↓
Feature Service/API
 ↓
Shared HTTP Client
 ↓
Backend API
```

Example:

```text
LoginPage
   ↓
LoginForm
   ↓
useLogin()
   ↓
authService.login()
   ↓
api.post()
   ↓
POST /auth/login
```

This follows the same separation principle as the uploaded architecture.

---

# 8. Authentication Architecture

A scalable authentication system can be organized as:

```text
client/features/auth/

├── api/
│   └── auth.service.ts
├── hooks/
│   ├── useLogin.ts
│   ├── useLogout.ts
│   └── useCurrentUser.ts
├── store/
│   └── auth.store.ts
├── components/
│   ├── LoginForm.tsx
│   └── LoginButton.tsx
├── schemas/
├── types/
├── mapper/
└── index.ts
```

Backend:

```text
server/modules/auth/

├── auth.routes.ts
├── auth.controller.ts
├── auth.service.ts
├── auth.repository.ts
├── auth.schema.ts
├── auth.types.ts
├── auth.mapper.ts
├── strategies/
│   ├── local.strategy.ts
│   ├── jwt.strategy.ts
│   └── google.strategy.ts
└── index.ts
```

---

# 9. Authentication Responsibility

Keep these responsibilities separate:

```text
Argon2
  ↓
Password hashing / verification

Passport
  ↓
Authentication strategies

jose
  ↓
JWT / JOSE operations

Session store
  ↓
Server-side session state

Database
  ↓
User persistence
```

Do not make one library responsible for everything.

---

# 10. Authentication Flow

Registration:

```text
Client
 ↓
POST /auth/register
 ↓
Validation
 ↓
Auth Controller
 ↓
Auth Service
 ↓
Argon2.hash()
 ↓
User Repository
 ↓
Database
```

Login:

```text
Client
 ↓
POST /auth/login
 ↓
Auth Controller
 ↓
Auth Service / Passport
 ↓
Argon2.verify()
 ↓
Create Session or JWT
 ↓
Response
```

Protected API:

```text
Client
 ↓
Authentication Middleware
 ↓
Verify JWT / Session
 ↓
req.user
 ↓
Controller
 ↓
Service
```

---

# 11. Feature-Based Frontend Rules

The original feature-based principle should remain strict:

> If code is specific to one business feature, keep it inside that feature.

Example:

```text
features/
├── auth/
├── users/
├── payments/
├── orders/
└── notifications/
```

Avoid:

```text
components/
services/
hooks/
stores/
```

containing files from every business domain.

Feature boundaries make large applications easier to navigate and refactor.

---

# 12. Shared Code

`shared/` should contain reusable, business-agnostic code.

Good:

```text
shared/components/Button
shared/components/Modal
shared/hooks/useDebounce
shared/utils/formatCurrency
shared/api/axios
```

Avoid:

```text
shared/components/LoginForm
shared/utils/paymentCalculator
shared/hooks/useUserPermissions
```

when these are specific to a single feature.

Use:

```text
features/auth/
features/payments/
features/users/
```

instead.

---

# 13. Frontend `app/`

The `app/` directory contains application-level infrastructure.

```text
app/

├── providers/
│   ├── QueryProvider.tsx
│   ├── ThemeProvider.tsx
│   └── StoreProvider.tsx
│
├── router/
│   ├── AppRouter.tsx
│   ├── routes.tsx
│   └── ProtectedRoute.tsx
│
├── config/
│   ├── env.ts
│   ├── constants.ts
│   └── queryKeys.ts
│
├── App.tsx
└── main.tsx
```

It should not contain feature-specific business logic.

---

# 14. Providers

Example:

```tsx
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

Typical providers:

```text
QueryProvider
ThemeProvider
RouterProvider
AuthProvider
StoreProvider
```

Only create providers when they are actually required.

---

# 15. Routing

```text
app/router/

├── AppRouter.tsx
├── routes.tsx
└── ProtectedRoute.tsx
```

Example:

```tsx
export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
];
```

Protected route:

```text
User
 ↓
ProtectedRoute
 ├── Authenticated → Page
 └── Unauthenticated → Login
```

---

# 16. API Layer

Frontend:

```text
shared/api/

├── axios.ts
├── interceptor.ts
└── http.ts
```

Axios instance:

```ts
export const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});
```

Interceptor responsibilities may include:

- Request headers
- Authentication handling
- Refresh-token flow
- Global 401 handling
- Error normalization

Keep feature-specific endpoints inside the feature.

---

# 17. Service Layer

Example:

```ts
export const loginApi = async (
  payload: LoginRequest
) => {
  const response = await api.post(
    "/auth/login",
    payload
  );

  return response.data;
};
```

Feature service:

```ts
export const authService = {
  login: loginApi,

  logout: async () => {
    await api.post("/auth/logout");
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");

    return response.data;
  },
};
```

---

# 18. Hooks

Use hooks to connect React to services.

```ts
export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
  });
}
```

Flow:

```text
Component
    ↓
useLogin()
    ↓
authService.login()
    ↓
HTTP client
    ↓
Backend
```

The component doesn't need to know the API URL or HTTP implementation.

---

# 19. Server State vs Client State

A useful rule:

```text
Server state → TanStack Query
Client state → Zustand
```

### TanStack Query

Use for:

```text
users
products
dashboard data
API responses
caching
refetching
loading states
server mutations
```

### Zustand

Use for:

```text
theme
sidebar
UI preferences
temporary client state
local interaction state
```

Don't duplicate the same server state in both TanStack Query and Zustand without a clear reason.

---

# 20. Feature Store

Example:

```ts
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}
```

Keep feature state inside:

```text
features/auth/store/
```

Global UI state can remain in:

```text
shared/
```

or a dedicated application-level store depending on the project.

---

# 21. Schemas

Keep validation close to the feature.

Example:

```text
features/auth/schemas/login.schema.ts
```

```ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

Backend should independently validate incoming requests.

Never rely only on frontend validation.

---

# 22. Mappers

Mappers isolate API structures from UI/domain models.

```text
API response
     ↓
  mapper
     ↓
UI model
```

Example:

```ts
export function mapUserResponse(
  data: UserApiResponse
): User {
  return {
    id: data._id,
    name: data.full_name,
    email: data.email,
  };
}
```

This is useful when backend response structures change.

---

# 23. Pages

Pages compose features.

```text
pages/
├── LoginPage.tsx
├── DashboardPage.tsx
└── ProfilePage.tsx
```

Example:

```tsx
function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
```

A page should answer:

> What should appear on this route?

Avoid putting API logic directly in pages.

---

# 24. Layouts

```text
layouts/

├── MainLayout.tsx
└── AuthLayout.tsx
```

Main layout:

```text
MainLayout
├── Header
├── Sidebar
├── Page Content
└── Footer
```

Auth layout:

```text
AuthLayout
└── Page Content
```

---

# 25. Naming Conventions

Components:

```text
LoginForm.tsx
UserCard.tsx
DashboardHeader.tsx
```

Hooks:

```text
useLogin.ts
useUsers.ts
useDebounce.ts
```

Services:

```text
auth.service.ts
user.service.ts
payment.service.ts
```

Stores:

```text
auth.store.ts
ui.store.ts
```

Schemas:

```text
login.schema.ts
user.schema.ts
```

Types:

```text
auth.types.ts
user.types.ts
```

Mappers:

```text
user.mapper.ts
response.mapper.ts
```

Backend:

```text
auth.controller.ts
auth.service.ts
auth.repository.ts
auth.routes.ts
auth.schema.ts
```

---

# 26. Dependency Direction

Prefer a predictable dependency direction.

Frontend:

```text
app
 ↓
pages
 ↓
features
 ↓
shared
```

Backend:

```text
routes
 ↓
controllers
 ↓
services
 ↓
repositories
 ↓
infrastructure
```

A key rule:

> Shared infrastructure should not depend on business features.

Avoid:

```text
shared/
└── components/
    └── AuthButton.tsx
```

if the component only belongs to authentication.

Prefer:

```text
features/
└── auth/
    └── components/
        └── LoginButton.tsx
```

---

# 27. Backend Infrastructure

Infrastructure contains technical integrations rather than business rules.

```text
infrastructure/

├── database/
│   ├── mongo.ts
│   └── indexes.ts
│
├── cache/
│   └── redis.ts
│
├── queue/
│   ├── bullmq.ts
│   └── workers.ts
│
├── mail/
│   └── mailer.ts
│
├── storage/
│   └── cloudinary.ts
│
└── observability/
    ├── metrics.ts
    └── tracing.ts
```

Examples:

```text
MongoDB
Redis
BullMQ
Kafka
Cloudinary
Email provider
OpenTelemetry
Prometheus
```

These are infrastructure concerns.

---

# 28. Configuration

Centralize environment configuration.

```text
server/src/config/

├── env.ts
├── logger.ts
├── database.ts
└── redis.ts
```

Flow:

```text
.env
 ↓
dotenv
 ↓
envalid
 ↓
config
 ↓
Application
```

Avoid reading `process.env` throughout business logic.

---

# 29. Error Architecture

Create centralized application errors:

```text
shared/errors/

├── AppError.ts
├── AuthError.ts
├── NotFoundError.ts
└── ValidationError.ts
```

Example:

```ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}
```

Central error middleware:

```ts
export const errorMiddleware = (
  error,
  req,
  res,
  next
) => {
  res.status(
    error.statusCode ?? 500
  ).json({
    message: error.message,
  });
};
```

Business code can throw errors without repeating response formatting.

---

# 30. Logging Architecture

Use a centralized logger:

```text
config/logger.ts
```

Example:

```ts
import pino from "pino";

export const logger = pino({
  level: env.LOG_LEVEL,
});
```

Request logging:

```text
Express
 ↓
pino-http
 ↓
Pino
```

Never log:

```text
password
access token
refresh token
JWT
session secret
API keys
authorization headers
authentication cookies
```

---

# 31. Authentication Middleware

Keep authentication middleware separate:

```text
middleware/

├── auth.middleware.ts
├── error.middleware.ts
├── rate-limit.middleware.ts
└── request-id.middleware.ts
```

Example responsibility:

```text
auth.middleware
→ Verify authentication
→ Attach req.user
→ Reject unauthorized requests
```

Authorization can be separate:

```text
authorize.middleware
```

Example:

```ts
authorize("admin")
```

This separates:

```text
Authentication
→ Who are you?

Authorization
→ What are you allowed to do?
```

---

# 32. Feature-Level Authorization

For complex applications, permissions can belong to a feature:

```text
modules/users/
├── user.permissions.ts
├── user.service.ts
└── ...
```

Example:

```ts
if (!canEditUser(actor, targetUser)) {
  throw new ForbiddenError();
}
```

Keep business authorization rules close to the relevant domain.

---

# 33. Testing Structure

A scalable project should test each layer.

Frontend:

```text
features/auth/

├── api/
├── hooks/
├── components/
└── __tests__/
```

Backend:

```text
modules/auth/

├── auth.controller.ts
├── auth.service.ts
├── auth.repository.ts
└── __tests__/
    ├── auth.service.test.ts
    └── auth.controller.test.ts
```

Recommended test levels:

```text
Unit
 ↓
Service / utility

Integration
 ↓
Repository / API

End-to-end
 ↓
Complete user flow
```

---

# 34. Don't Over-Create Folders

Not every feature needs every directory.

Small feature:

```text
features/notifications/

├── api/
├── hooks/
├── components/
└── index.ts
```

Do not create empty:

```text
store/
schemas/
mapper/
utils/
types/
```

until required.

The architecture should **grow with the feature**.

---

# 35. Feature Public API

Use `index.ts` to expose a controlled API.

```ts
export { LoginForm } from "./components/LoginForm";
export { useLogin } from "./hooks/useLogin";
export { useCurrentUser } from "./hooks/useCurrentUser";
```

Then:

```ts
import {
  LoginForm,
  useLogin,
} from "@/features/auth";
```

instead of deep imports:

```ts
import { LoginForm }
  from "@/features/auth/components/LoginForm";
```

This creates a stronger feature boundary.

---

# 36. Monorepo Shared Types

For larger full-stack projects:

```text
packages/
└── types/
    ├── auth.ts
    ├── user.ts
    └── api.ts
```

Then:

```text
client ──┐
         ├── packages/types
server ──┘
```

Use shared types carefully.

Do not share server-only types such as:

```text
database models
repository types
private configuration
server secrets
```

Share only contracts that are genuinely common.

---

# 37. API Contract

A consistent API response makes the frontend easier to maintain.

Example:

```json
{
  "success": true,
  "data": {
    "id": "123",
    "email": "user@example.com"
  },
  "message": "User fetched successfully"
}
```

Error:

```json
{
  "success": false,
  "message": "Invalid credentials",
  "code": "AUTH_INVALID_CREDENTIALS"
}
```

Keep API contracts stable and version them when necessary.

---

# 38. Scalability Boundaries

When the application grows:

```text
Small
 ↓
Feature-based monolith
 ↓
Modular monolith
 ↓
Service extraction
```

Start with a modular monolith rather than prematurely creating microservices.

Example:

```text
modules/
├── auth/
├── users/
├── payments/
├── orders/
└── notifications/
```

Each module has a clear boundary.

Later, a high-load module can be extracted if there is a real architectural reason.

---

# 39. Scalable Request Flow

Full-stack request:

```text
Browser
   ↓
React Page
   ↓
Feature Component
   ↓
Feature Hook
   ↓
Feature Service
   ↓
Axios
   ↓
Nginx / API Gateway
   ↓
Express
   ↓
Middleware
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MongoDB
```

Supporting infrastructure:

```text
Service
 ├── Redis
 ├── BullMQ
 ├── Kafka
 ├── Mail
 └── External APIs
```

Observability:

```text
Application
 ├── Pino
 ├── OpenTelemetry
 ├── Prometheus
 └── Metrics / Logs / Traces
```

---

# 40. Example: Authentication Full Stack

```text
CLIENT

pages/LoginPage
       ↓
features/auth/components/LoginForm
       ↓
features/auth/hooks/useLogin
       ↓
features/auth/api/auth.service
       ↓
shared/api/axios
       ↓
       HTTP
       ↓
SERVER

routes/auth.routes
       ↓
auth.controller
       ↓
auth.service
       ↓
passport / argon2 / jose
       ↓
auth.repository
       ↓
MongoDB
```

This is the preferred separation of responsibilities.

---

# 41. Recommended Final Project Structure

```text
my-app/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── providers/
│   │   │   ├── router/
│   │   │   ├── config/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── api/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── store/
│   │   │   │   ├── schemas/
│   │   │   │   ├── types/
│   │   │   │   ├── mapper/
│   │   │   │   ├── utils/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── users/
│   │   │   ├── dashboard/
│   │   │   └── payments/
│   │   │
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── shared/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   ├── helpers/
│   │   │   ├── constants/
│   │   │   ├── lib/
│   │   │   ├── types/
│   │   │   └── validation/
│   │   │
│   │   └── assets/
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts
│   │   │   ├── routes.ts
│   │   │   └── providers.ts
│   │   │
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── logger.ts
│   │   │   ├── database.ts
│   │   │   └── redis.ts
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── strategies/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.repository.ts
│   │   │   │   ├── auth.schema.ts
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── auth.mapper.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── users/
│   │   │   ├── payments/
│   │   │   └── notifications/
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   └── request-id.middleware.ts
│   │   │
│   │   ├── infrastructure/
│   │   │   ├── database/
│   │   │   ├── cache/
│   │   │   ├── queue/
│   │   │   ├── mail/
│   │   │   ├── storage/
│   │   │   └── observability/
│   │   │
│   │   ├── shared/
│   │   │   ├── errors/
│   │   │   ├── types/
│   │   │   ├── constants/
│   │   │   ├── utils/
│   │   │   └── validators/
│   │   │
│   │   ├── routes/
│   │   │   └── index.ts
│   │   │
│   │   └── server.ts
│   │
│   └── package.json
│
├── packages/
│   └── types/
│
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md
```

---

# 42. Golden Rules

```text
1. Feature-specific code → features/ or modules/

2. Generic reusable code → shared/

3. UI → components

4. React behavior → hooks

5. API communication → services

6. Server state → TanStack Query

7. Client state → Zustand

8. Validation → schemas

9. Data transformation → mappers

10. HTTP handling → controllers

11. Business logic → services

12. Database access → repositories

13. Infrastructure → infrastructure/

14. Authentication → middleware/strategies

15. Password hashing → Argon2

16. JWT/JOSE → jose

17. Authentication strategies → Passport

18. Logging → Pino

19. Global configuration → config/

20. Routing → app/router or routes/

21. Generic shared code must not depend on features

22. Avoid API calls directly inside UI components

23. Avoid business logic directly inside UI components

24. Avoid database queries directly inside controllers

25. Don't create folders until they are needed

26. Keep modules independently understandable

27. Prefer a modular monolith before microservices

28. Keep public APIs controlled with index.ts

29. Never log passwords, tokens, or secrets

30. Validate input at system boundaries
```

---

# 43. Final Mental Model

```text
                         FULL-STACK APPLICATION
                                  │
              ┌───────────────────┴───────────────────┐
              │                                       │
           CLIENT                                   SERVER
              │                                       │
             app                                      app
              │                                       │
            pages                                    routes
              │                                       │
           features                                middleware
              │                                       │
          components                              controllers
              │                                       │
            hooks                                  services
              │                                       │
          services                               repositories
              │                                       │
          shared                                infrastructure
              │                                       │
              └────────────── HTTP/API ───────────────┘
```

The central principle is:

```text
UI
 ↓
Hook
 ↓
Service
 ↓
HTTP
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database
```

This keeps the application **feature-oriented, modular, testable, maintainable, and scalable** without turning components or controllers into large containers for unrelated logic.
