# Improvement Plans for @sudobility/whisperly_client

## Priority 1 - High Impact

### 1. Add JSDoc Comments to WhisperlyClient Methods
- The `WhisperlyClient` class has 17 public methods, none of which have JSDoc comments describing parameters, return types, possible errors, or usage examples.
- Methods like `translate()` have complex parameter signatures (`orgPath`, `projectName`, `request`, `testMode`, `apiKey`) where the relationship between parameters is non-obvious.
- `getRateLimits()` and `getRateLimitHistory()` return `Promise<unknown>`, indicating the return types are untyped -- these need proper type annotations backed by JSDoc explaining the expected response shape.
- Hook files (`useProjects.ts`, `useDictionary.ts`, `useSettings.ts`, `useLanguages.ts`, `useAnalytics.ts`, `useTranslate.ts`) export hooks without JSDoc explaining their parameters, query key dependencies, or invalidation behavior.

### 2. Type the Rate Limit Methods Properly
- `getRateLimits()` returns `Promise<unknown>` and `getRateLimitHistory()` returns `Promise<unknown>`, which defeats the purpose of a typed API client.
- `whisperly_types` already defines `RateLimitStatus` which should be used as the return type for `getRateLimits()`.
- A `RateLimitHistory` type should be defined in `whisperly_types` and used for `getRateLimitHistory()`.
- This is a type-safety gap that propagates to all downstream consumers.

### 3. Improve Error Handling Consistency
- `deleteProject()` throws a generic `new Error(...)` on failure instead of using `WhisperlyApiError` like all other methods (which go through `handleNetworkResponse`).
- `handleNetworkResponse` does an unsafe cast: `const json = response.data as Record<string, unknown> | null` followed by `return json as T`, which silently returns malformed data without validation.
- No retry logic or timeout handling exists for any API calls.

## Priority 2 - Medium Impact

### 4. Add Tests for Hook Files
- Current test files cover `types.test.ts`, `whisperly-helpers.test.ts`, and `WhisperlyClient.test.ts`.
- Zero test coverage for any of the 6 hook files (`useProjects.ts`, `useDictionary.ts`, `useSettings.ts`, `useLanguages.ts`, `useAnalytics.ts`, `useTranslate.ts`).
- Hooks contain conditional logic (e.g., `enabled: !!entitySlug`), mutation success callbacks with query invalidation, and query key composition that should be tested.
- Testing hooks would require `@testing-library/react-hooks` or equivalent setup with `QueryClientProvider` mocking.

### 5. Extract Duplicated Query Parameter Building Logic
- `WhisperlyClient` uses `formatQueryParams()` in `getAnalytics()`, `getRateLimits()`, `getRateLimitHistory()`, and `translate()`, but `deleteProject()` and other methods handle URL construction differently.
- The pattern of building URLs with query params could be centralized into the `url()` private method to accept an optional params object.

### 6. Add Request/Response Logging or Interceptor Support
- No mechanism exists for consumers to intercept requests (e.g., for logging, analytics, or token refresh).
- Adding an optional `onRequest`/`onResponse` callback or middleware chain to `WhisperlyClientConfig` would enable debugging and observability without modifying the client internals.

## Priority 3 - Nice to Have

### 7. Add AbortController Support for Cancellable Requests
- No methods accept an `AbortSignal` for request cancellation, which is important for React components that unmount during in-flight requests.
- TanStack Query supports signal forwarding, but the current hook implementations do not pass signals through to the client methods.

### 8. Consolidate Re-exports Strategy
- `src/index.ts` re-exports 14 types from `@sudobility/whisperly_types`, but not all types (missing `User`, `UserCreateRequest`, `UsageRecord`, `RateLimitStatus`, etc.).
- Either re-export all types for convenience (so consumers only need one import source) or document which types must be imported directly from `whisperly_types`.
