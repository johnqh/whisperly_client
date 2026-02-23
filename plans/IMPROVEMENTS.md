# Improvement Plans for @sudobility/whisperly_client

## Priority 1 - High Impact

### 1. Add JSDoc Comments to WhisperlyClient Methods -- COMPLETED
- The `WhisperlyClient` class has 17 public methods, none of which have JSDoc comments describing parameters, return types, possible errors, or usage examples.
- Methods like `translate()` have complex parameter signatures (`orgPath`, `projectName`, `request`, `testMode`, `apiKey`) where the relationship between parameters is non-obvious.
- `getRateLimits()` and `getRateLimitHistory()` return `Promise<unknown>`, indicating the return types are untyped -- these need proper type annotations backed by JSDoc explaining the expected response shape.
- Hook files (`useProjects.ts`, `useDictionary.ts`, `useSettings.ts`, `useLanguages.ts`, `useAnalytics.ts`, `useTranslate.ts`) export hooks without JSDoc explaining their parameters, query key dependencies, or invalidation behavior.

**Status: DONE** -- JSDoc comments added to all `WhisperlyClient` methods (17 methods + constructor + private `url()` helper), all 6 hook files, all utility functions (`buildUrl`, `handleNetworkResponse`, `formatQueryParams`, `WhisperlyApiError`), and type definitions (`WhisperlyClientConfig`, `QUERY_KEYS`, `QueryKeys`, `UseAnalyticsOptions`).

### 2. Type the Rate Limit Methods Properly -- COMPLETED
- `getRateLimits()` returns `Promise<unknown>` and `getRateLimitHistory()` returns `Promise<unknown>`, which defeats the purpose of a typed API client.
- `whisperly_types` already defines `RateLimitStatus` which should be used as the return type for `getRateLimits()`.
- A `RateLimitHistory` type should be defined in `whisperly_types` and used for `getRateLimitHistory()`.
- This is a type-safety gap that propagates to all downstream consumers.

**Status: DONE** -- `getRateLimits()` now returns `Promise<RateLimitStatus>` and `getRateLimitHistory()` returns `Promise<RateLimitStatus[]>`, both using the `RateLimitStatus` type from `@sudobility/whisperly_types`. The `RateLimitStatus` and `RateLimitTier` types are also re-exported from the package barrel for consumer convenience.

### 3. Improve Error Handling Consistency -- COMPLETED
- `deleteProject()` throws a generic `new Error(...)` on failure instead of using `WhisperlyApiError` like all other methods (which go through `handleNetworkResponse`).
- `handleNetworkResponse` does an unsafe cast: `const json = response.data as Record<string, unknown> | null` followed by `return json as T`, which silently returns malformed data without validation.
- No retry logic or timeout handling exists for any API calls.

**Status: PARTIALLY DONE** -- `deleteProject()` now throws `WhisperlyApiError` with proper `statusCode` and `details` fields, matching the error handling pattern used by all other methods. Tests updated to verify the error type and properties. Retry logic and runtime validation were skipped as they require architectural changes (middleware/interceptor pattern).

## Priority 2 - Medium Impact

### 4. Add Tests for Hook Files -- COMPLETED
- Current test files cover `types.test.ts`, `whisperly-helpers.test.ts`, and `WhisperlyClient.test.ts`.
- Zero test coverage for any of the 6 hook files (`useProjects.ts`, `useDictionary.ts`, `useSettings.ts`, `useLanguages.ts`, `useAnalytics.ts`, `useTranslate.ts`).
- Hooks contain conditional logic (e.g., `enabled: !!entitySlug`), mutation success callbacks with query invalidation, and query key composition that should be tested.
- Testing hooks would require `@testing-library/react-hooks` or equivalent setup with `QueryClientProvider` mocking.

**Status: DONE** -- Created `src/hooks/hooks.test.ts` with 31 tests covering all 10 hooks across all 6 hook files. Tests use `@testing-library/react` `renderHook` with `QueryClientProvider` wrapper and `MockNetworkClient`. Tests cover: successful data fetching, `enabled` guard logic (empty params prevent fetch), mutation exposure, refetch helpers, and mutation execution. Total project test count went from 46 to 77.

### 5. Extract Duplicated Query Parameter Building Logic -- COMPLETED
- `WhisperlyClient` uses `formatQueryParams()` in `getAnalytics()`, `getRateLimits()`, `getRateLimitHistory()`, and `translate()`, but `deleteProject()` and other methods handle URL construction differently.
- The pattern of building URLs with query params could be centralized into the `url()` private method to accept an optional params object.

**Status: DONE** -- The private `url()` method now accepts an optional `params` object of type `Record<string, string | number | boolean | undefined>`. It calls `formatQueryParams()` internally when params are provided. All methods that previously called `formatQueryParams()` directly (`getAnalytics`, `getRateLimits`, `getRateLimitHistory`, `translate`) now pass params through `url()`, eliminating the duplicated pattern.

### 6. Add Request/Response Logging or Interceptor Support
- No mechanism exists for consumers to intercept requests (e.g., for logging, analytics, or token refresh).
- Adding an optional `onRequest`/`onResponse` callback or middleware chain to `WhisperlyClientConfig` would enable debugging and observability without modifying the client internals.

**Status: SKIPPED** -- Requires architectural changes to the client (middleware pattern, config changes). The `NetworkClient` abstraction from `@sudobility/types` already provides the interception point at the network layer.

## Priority 3 - Nice to Have

### 7. Add AbortController Support for Cancellable Requests
- No methods accept an `AbortSignal` for request cancellation, which is important for React components that unmount during in-flight requests.
- TanStack Query supports signal forwarding, but the current hook implementations do not pass signals through to the client methods.

**Status: SKIPPED** -- Requires changes to all method signatures and the `NetworkClient` interface from `@sudobility/types`.

### 8. Consolidate Re-exports Strategy -- COMPLETED
- `src/index.ts` re-exports 14 types from `@sudobility/whisperly_types`, but not all types (missing `User`, `UserCreateRequest`, `UsageRecord`, `RateLimitStatus`, etc.).
- Either re-export all types for convenience (so consumers only need one import source) or document which types must be imported directly from `whisperly_types`.

**Status: DONE** -- Added re-exports for `RateLimitStatus`, `RateLimitTier`, `UsageAggregate`, `UsageByProject`, `UsageByDate`, `User`, `UserCreateRequest`, and `UsageRecord`. The barrel now re-exports all commonly used types so consumers can import from `@sudobility/whisperly_client` without needing direct imports from `@sudobility/whisperly_types`.

## Additional Improvements Made

### 9. Added `verify` Script
- Added `"verify": "bun run typecheck && bun run lint && bun run test:run && bun run build"` to `package.json` scripts, matching the convention used across other Sudobility projects.

### 10. Added Additional Client Tests
- Added tests for `getDictionaries`, `getProjectLanguages`, `updateProjectLanguages`, `getAvailableLanguages`, `generateProjectApiKey`, `deleteProjectApiKey`, and `getRateLimitHistory` methods that were previously untested.
