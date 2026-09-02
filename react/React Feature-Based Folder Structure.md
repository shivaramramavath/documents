# React Feature-Based Folder Structure

A scalable React application architecture based on **feature-based organization**, **separation of concerns**, and **service-driven data access**.

The main principle is:

> **Components handle UI. Services handle API communication. Hooks handle React-side behavior. Stores handle client state. Features own business-specific code.**

---

## 1. Project Structure

```text
src/
│
├── app/
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── StoreProvider.tsx
│   │
│   ├── router/
│   │   ├── AppRouter.tsx
│   │   ├── routes.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── constants.ts
│   │   └── queryKeys.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── shared/
│   ├── api/
│   │   ├── axios.ts
│   │   ├── interceptor.ts
│   │   └── http.ts
│   │
│   ├── components/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Loader/
│   │
│   ├── hooks/
│   ├── utils/
│   ├── helpers/
│   ├── constants/
│   ├── lib/
│   ├── types/
│   └── validation/
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   ├── auth.service.ts
│   │   │   └── auth.api.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   ├── useLogout.ts
│   │   │   └── useCurrentUser.ts
│   │   │
│   │   ├── store/
│   │   │   └── auth.store.ts
│   │   │
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── LoginButton.tsx
│   │   │
│   │   ├── types/
│   │   ├── schemas/
│   │   ├── mapper/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── users/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── components/
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── dashboard/
│       ├── api/
│       ├── hooks/
│       ├── store/
│       ├── components/
│       └── index.ts
│
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── ProfilePage.tsx
│
├── layouts/
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
│
├── assets/
│
└── index.css
```

---

# 2. Architecture Principles

This structure follows several important rules.

### Rule 1 — Organize by feature

Business-specific code belongs inside `features/`.

```text
features/
├── auth/
├── users/
├── dashboard/
└── payments/
```

Instead of:

```text
components/
services/
hooks/
stores/
utils/
```

containing files from every business domain.

This keeps related code together.

---

### Rule 2 — Components should primarily handle UI

A component should focus on:

- Rendering UI
- Receiving props
- Handling UI events
- Calling hooks
- Displaying loading/error/success states

Avoid putting API calls directly inside components.

### Avoid

```tsx
function LoginForm() {
  const handleLogin = async () => {
    await axios.post("/auth/login", {
      email,
      password,
    });
  };

  return <form>...</form>;
}
```

### Prefer

```tsx
function LoginForm() {
  const login = useLogin();

  const handleSubmit = () => {
    login.mutate({
      email,
      password,
    });
  };

  return <form>...</form>;
}
```

The component does not need to know how the API works.

---

# 3. `app/`

The `app/` directory contains application-level configuration.

It should not contain feature-specific business logic.

```text
app/
├── providers/
├── router/
├── config/
├── App.tsx
└── main.tsx
```

---

## `app/providers/`

Contains global providers.

Examples:

```text
QueryProvider.tsx
ThemeProvider.tsx
StoreProvider.tsx
```

### QueryProvider

Responsible for configuring TanStack Query.

```tsx
<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
```

### ThemeProvider

Handles application-wide theme configuration.

### StoreProvider

Used only when a global store requires a provider.

---

# 4. `app/router/`

Application routing configuration.

```text
router/
├── AppRouter.tsx
├── routes.tsx
└── ProtectedRoute.tsx
```

### `routes.tsx`

Defines application routes.

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

### `ProtectedRoute.tsx`

Controls access to authenticated routes.

```text
User
 │
 ▼
ProtectedRoute
 │
 ├── Authenticated → Page
 │
 └── Not Authenticated → Login
```

---

# 5. `app/config/`

Application-wide configuration.

```text
config/
├── env.ts
├── constants.ts
└── queryKeys.ts
```

### `env.ts`

Centralizes environment variables.

```ts
export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
};
```

Do not access `import.meta.env` throughout the application.

---

### `constants.ts`

Application-level constants.

```ts
export const APP_NAME = "My Application";
```

---

### `queryKeys.ts`

Centralized TanStack Query keys.

```ts
export const queryKeys = {
  auth: {
    currentUser: ["auth", "current-user"],
  },

  users: {
    all: ["users"],
    detail: (id: string) => ["users", id],
  },
};
```

This prevents inconsistent query keys.

---

# 6. `shared/`

`shared/` contains code that is reusable across multiple features.

```text
shared/
├── api/
├── components/
├── hooks/
├── utils/
├── helpers/
├── constants/
├── lib/
├── types/
└── validation/
```

A simple rule:

> If code is specific to one feature, keep it inside that feature.

> If multiple unrelated features can use it, consider `shared/`.

---

# 7. `shared/api/`

Contains the application's HTTP infrastructure.

```text
shared/api/
├── axios.ts
├── interceptor.ts
└── http.ts
```

### `axios.ts`

Creates the Axios instance.

```ts
export const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});
```

### `interceptor.ts`

Handles global HTTP behavior.

Examples:

- Access token handling
- Refresh token handling
- Global 401 handling
- Request headers
- Response normalization

### `http.ts`

Optional abstraction around HTTP operations.

```ts
export const http = {
  get: <T>(url: string) => api.get<T>(url),
  post: <T>(url: string, data?: unknown) => api.post<T>(url, data),
};
```

---

# 8. `shared/components/`

Contains reusable UI components.

```text
components/
├── Button/
├── Input/
├── Modal/
└── Loader/
```

These components should generally be **business-agnostic**.

For example:

```tsx
<Button loading={isLoading}>Login</Button>
```

The Button should not know anything about authentication.

---

# 9. `shared/hooks/`

Generic reusable React hooks.

Examples:

```text
useDebounce.ts
useMediaQuery.ts
useClickOutside.ts
useLocalStorage.ts
```

A hook belongs here when it is not related to a specific feature.

---

# 10. `shared/utils/`

Pure reusable utility functions.

Examples:

```text
formatDate.ts
formatCurrency.ts
truncateText.ts
generateId.ts
```

Example:

```ts
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
}
```

Utilities should preferably be:

- Pure
- Predictable
- Reusable
- Independent from React

---

# 11. `shared/helpers/`

Helpers are useful for application-specific transformations that don't fit naturally into pure utilities.

For example:

```text
helpers/
├── permission.helper.ts
├── route.helper.ts
└── response.helper.ts
```

Keep this directory small.

If something is clearly a utility, put it in `utils/`.

---

# 12. `shared/types/`

Global reusable TypeScript types.

Examples:

```ts
export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}
```

Feature-specific types should remain inside the feature.

---

# 13. `features/`

This is the core of the architecture.

```text
features/
├── auth/
├── users/
├── dashboard/
└── ...
```

Each feature owns its own:

- API
- Hooks
- Store
- Components
- Types
- Schemas
- Mappers
- Feature utilities

This creates a strong boundary around business domains.

---

# 14. Feature Structure

Example:

```text
features/auth/
│
├── api/
│   ├── auth.service.ts
│   └── auth.api.ts
│
├── hooks/
│   ├── useLogin.ts
│   ├── useLogout.ts
│   └── useCurrentUser.ts
│
├── store/
│   └── auth.store.ts
│
├── components/
│   ├── LoginForm.tsx
│   └── LoginButton.tsx
│
├── types/
├── schemas/
├── mapper/
├── utils/
│
└── index.ts
```

---

# 15. `features/*/api/`

Contains feature-specific API communication.

For example:

```text
auth/
└── api/
    ├── auth.service.ts
    └── auth.api.ts
```

A useful distinction:

### `auth.api.ts`

Defines the low-level API request.

```ts
export const loginApi = async (payload: LoginRequest) => {
  const response = await api.post("/auth/login", payload);

  return response.data;
};
```

### `auth.service.ts`

Contains feature-level data/service operations.

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

The exact separation between `api.ts` and `service.ts` is optional.

For smaller features, one service file can be enough.

---

# 16. `features/*/hooks/`

Contains feature-specific React hooks.

Example:

```ts
export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
  });
}
```

The flow becomes:

```text
Component
    │
    ▼
 useLogin()
    │
    ▼
authService.login()
    │
    ▼
 loginApi()
    │
    ▼
   HTTP
    │
    ▼
 Backend
```

This keeps components clean.

---

# 17. `features/*/store/`

Contains feature-specific client state.

For example, with Zustand:

```ts
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}
```

Use Zustand for **client state**, not as a replacement for server-state management.

### Good Zustand state

```text
theme
sidebar state
selected item
UI preferences
authentication UI state
temporary client state
```

### Prefer TanStack Query for

```text
users from API
products from API
dashboard data
server-side entities
API caching
loading/error states
refetching
```

A useful rule:

> **Server state → TanStack Query**

> **Client state → Zustand**

---

# 18. `features/*/components/`

Contains components specific to the feature.

Example:

```text
auth/components/
├── LoginForm.tsx
└── LoginButton.tsx
```

These components can understand authentication concepts.

For example:

```tsx
<LoginForm />
```

can use:

```ts
useLogin();
```

because both belong to the `auth` feature.

---

# 19. `features/*/schemas/`

Validation schemas.

For example, using Zod:

```ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

Schemas should be close to the feature they validate.

---

# 20. `features/*/mapper/`

Used to transform data between different representations.

For example:

```text
API response
     │
     ▼
   mapper
     │
     ▼
UI model
```

Example:

```ts
export function mapUserResponse(data: UserApiResponse): User {
  return {
    id: data._id,
    name: data.full_name,
    email: data.email,
  };
}
```

This prevents API-specific structures from leaking throughout the UI.

---

# 21. `features/*/types/`

Feature-specific TypeScript types.

Example:

```text
auth/types/
├── auth.types.ts
└── user.types.ts
```

Do not put every type into `shared/types`.

Only globally reusable types belong there.

---

# 22. `features/*/utils/`

Feature-specific utility functions.

For example:

```text
auth/utils/
├── password.helper.ts
└── auth.helper.ts
```

If the utility only makes sense for authentication, it belongs inside `auth`.

---

# 23. `index.ts`

Each feature can expose a controlled public API.

Example:

```ts
export { LoginForm } from "./components/LoginForm";
export { useLogin } from "./hooks/useLogin";
export { useCurrentUser } from "./hooks/useCurrentUser";
```

Then elsewhere:

```ts
import { LoginForm, useLogin } from "@/features/auth";
```

Instead of:

```ts
import { LoginForm } from "@/features/auth/components/LoginForm";
```

This creates a cleaner feature boundary.

---

# 24. `pages/`

Pages compose features and layouts.

```text
pages/
├── LoginPage.tsx
├── DashboardPage.tsx
└── ProfilePage.tsx
```

A page should primarily answer:

> **What should appear on this route?**

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

Avoid putting API logic inside pages.

---

# 25. `layouts/`

Layouts define application-level page structures.

```text
layouts/
├── MainLayout.tsx
└── AuthLayout.tsx
```

For example:

```text
MainLayout
├── Header
├── Sidebar
├── Page Content
└── Footer
```

While:

```text
AuthLayout
└── Page Content
```

---

# 26. `assets/`

Static assets.

```text
assets/
├── images/
├── icons/
├── fonts/
└── ...
```

Keep feature-specific assets inside the feature if they are not globally reused.

For example:

```text
features/
└── auth/
    └── assets/
```

---

# 27. Recommended Data Flow

The preferred architecture is:

```text
                 ┌───────────────┐
                 │     Page      │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │   Component   │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │     Hook      │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    Service    │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  API / HTTP   │
                 └───────┬───────┘
                         │
                         ▼
                    Backend API
```

For server state:

```text
Backend
   │
   ▼
API
   │
   ▼
Service
   │
   ▼
TanStack Query
   │
   ▼
Hook
   │
   ▼
Component
```

For client state:

```text
Component
    │
    ▼
Zustand Hook
    │
    ▼
Feature Store
```

---

# 28. Where Should Business Logic Go?

Avoid this:

```tsx
function UserList() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const response = await axios.get("/users");

    const activeUsers = response.data.filter(
      (user) => user.status === "active",
    );

    setUsers(activeUsers);
  };

  // ...
}
```

Instead:

```text
UserList
   │
   ▼
useUsers()
   │
   ▼
userService.getUsers()
   │
   ▼
API
```

Then transformations can happen in:

```text
mapper/
service/
utils/
```

depending on the responsibility.

The component remains focused on rendering.

---

# 29. Components Should Be as Dumb as Practical

A component should ideally look like:

```tsx
function UserList() {
  const { data, isLoading } = useUsers();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {data?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

It doesn't need to know:

- Axios
- API URLs
- HTTP methods
- caching
- request configuration
- authentication headers
- response parsing

Those concerns belong elsewhere.

---

# 30. Naming Conventions

## Components

Use PascalCase:

```text
LoginForm.tsx
UserCard.tsx
DashboardHeader.tsx
```

---

## Hooks

Prefix with `use`:

```text
useLogin.ts
useUsers.ts
useDebounce.ts
```

---

## Services

Use `.service.ts`:

```text
auth.service.ts
user.service.ts
payment.service.ts
```

---

## Stores

Use `.store.ts`:

```text
auth.store.ts
user.store.ts
ui.store.ts
```

---

## Schemas

Use `.schema.ts`:

```text
login.schema.ts
user.schema.ts
```

---

## Types

Use `.types.ts`:

```text
auth.types.ts
user.types.ts
```

---

## Mappers

Use `.mapper.ts`:

```text
user.mapper.ts
response.mapper.ts
```

---

# 31. Dependency Direction

Try to maintain this direction:

```text
app
 │
 ▼
pages
 │
 ▼
features
 │
 ├── components
 ├── hooks
 ├── services
 ├── stores
 └── utils
 │
 ▼
shared
```

The important rule is:

> **Shared code should not depend on a feature.**

Avoid:

```text
shared/
└── components/
    └── AuthButton.tsx
```

if `AuthButton` only belongs to authentication.

Instead:

```text
features/
└── auth/
    └── components/
        └── LoginButton.tsx
```

---

# 32. Shared vs Feature

When deciding where something belongs, ask:

### Is it business-specific?

```text
LoginForm
UserTable
PaymentForm
OrderCard
```

Put it inside:

```text
features/
```

### Is it generic?

```text
Button
Input
Modal
Loader
Dialog
Pagination
```

Put it inside:

```text
shared/
```

### Example

```text
shared/components/Button
```

Good.

```text
features/auth/components/LoginForm
```

Good.

```text
shared/components/LoginForm
```

Usually wrong.

---

# 33. Don't Over-Create Folders

Not every feature needs every folder.

For a small feature:

```text
features/
└── notification/
    ├── api/
    ├── hooks/
    ├── components/
    └── index.ts
```

You don't need:

```text
store/
schemas/
mapper/
utils/
types/
```

until they are actually required.

The architecture should scale with the feature instead of creating empty folders everywhere.

---

# 34. Example: Authentication Feature

```text
features/auth/
│
├── api/
│   └── auth.service.ts
│
├── hooks/
│   ├── useLogin.ts
│   ├── useLogout.ts
│   └── useCurrentUser.ts
│
├── store/
│   └── auth.store.ts
│
├── components/
│   ├── LoginForm.tsx
│   └── LoginButton.tsx
│
├── schemas/
│   └── login.schema.ts
│
├── types/
│   └── auth.types.ts
│
├── mapper/
│   └── user.mapper.ts
│
└── index.ts
```

Flow:

```text
LoginPage
    │
    ▼
LoginForm
    │
    ▼
useLogin()
    │
    ▼
authService.login()
    │
    ▼
HTTP Client
    │
    ▼
Backend
```

---

# 35. Recommended Rules

### Components

```text
UI + events + hooks
```

### Hooks

```text
React behavior + server-state interaction
```

### Services

```text
API/data operations
```

### Stores

```text
Client-side state
```

### Schemas

```text
Validation
```

### Mappers

```text
Data transformation
```

### Utils

```text
Pure reusable functions
```

### Pages

```text
Route-level composition
```

### Layouts

```text
Page structure
```

### Shared

```text
Generic reusable code
```

### App

```text
Application infrastructure
```

---

# 36. Golden Rules

Keep these rules in mind when adding new code:

```text
1. Feature-specific code → features/

2. Generic reusable code → shared/

3. API communication → services/api

4. Server state → TanStack Query

5. Client state → Zustand

6. UI logic → components/hooks

7. Validation → schemas

8. API → UI transformation → mapper

9. Route composition → pages

10. Page structure → layouts

11. Global configuration → app/config

12. Global providers → app/providers

13. Routing → app/router

14. Avoid API calls directly inside components

15. Avoid business logic directly inside UI components

16. Don't put feature-specific code inside shared/

17. Don't create folders until they are needed

18. Expose feature APIs through index.ts
```

---

# 37. Final Architecture

The overall mental model is:

```text
                         APPLICATION
                              │
                ┌─────────────┴─────────────┐
                │                           │
              app                         shared
                │                           │
       ┌────────┼────────┐          ┌───────┼────────┐
       │        │        │          │       │        │
   providers  router   config      API      UI     Utils
       │
       ▼
     pages
       │
       ▼
    layouts
       │
       ▼
    features
       │
   ┌───┴───────────────────────────┐
   │                               │
  auth                           users
   │                               │
   ├── api                         ├── api
   ├── hooks                       ├── hooks
   ├── store                       ├── store
   ├── components                  ├── components
   ├── types                       ├── types
   ├── schemas                     └── ...
   ├── mapper
   └── utils
```

The key architectural boundary is:

```text
             UI
              │
              ▼
          Components
              │
              ▼
            Hooks
              │
       ┌──────┴──────┐
       ▼             ▼
 TanStack Query    Zustand
       │             │
       ▼             ▼
    Services       Store
       │
       ▼
      API
```

This structure keeps the application **feature-oriented, testable, maintainable, and scalable** while preventing components from becoming containers for API calls and business logic.
