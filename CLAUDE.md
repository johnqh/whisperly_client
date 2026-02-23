# CLAUDE.md - whisperly_client

## Project Overview

`@sudobility/whisperly_client` is the typed API client library for the Whisperly platform. It provides a `WhisperlyClient` class wrapping all API endpoints and TanStack Query hooks for React data fetching.

**Platform**: Web + React Native (no DOM APIs). Tests use node environment.

## Package Manager

**Bun** (not npm/yarn): `bun install`, `bun run <script>`, `bun add <package>`

## Project Structure

```
src/
├── index.ts                       # Barrel export (all public API)
├── types.ts                       # QUERY_KEYS, WhisperlyClientConfig, FirebaseIdToken, AuthHeaders
├── types.test.ts                  # Types tests
├── network/
│   ├── WhisperlyClient.ts         # Main API client class (all fetch calls)
│   └── WhisperlyClient.test.ts    # Client tests
├── hooks/
│   ├── index.ts                   # Hooks barrel export
│   ├── useProjects.ts             # useProjects, useProject, useGenerateApiKey, useDeleteApiKey
│   ├── useDictionary.ts           # useDictionaries, useSearchDictionary
│   ├── useLanguages.ts            # useProjectLanguages, useAvailableLanguages
│   ├── useSettings.ts             # useSettings
│   ├── useAnalytics.ts            # useAnalytics (+ UseAnalyticsOptions type)
│   └── useTranslate.ts            # useTranslate
└── utils/
    ├── whisperly-helpers.ts       # createAuthHeaders, buildUrl, handleApiResponse, formatQueryParams, WhisperlyApiError
    └── whisperly-helpers.test.ts  # Utility tests
```

## Key Scripts

```bash
bun run build        # Build TypeScript to dist/
bun run build:watch  # Build in watch mode
bun run typecheck    # TypeScript type checking
bun run lint         # ESLint
bun run test:run     # Run tests once
bun run verify       # typecheck + lint + test + build (use before committing)
```

## WhisperlyClient API Methods

All methods use `fetch()` internally. Authenticated methods call `createAuthHeaders(getIdToken)` for Bearer token.

### Projects — `/entities/:entitySlug/projects`
| Method | Params | Returns |
|--------|--------|---------|
| `getProjects(entitySlug)` | | `Project[]` |
| `getProject(entitySlug, projectId)` | | `Project` |
| `createProject(entitySlug, data)` | `ProjectCreateRequest` | `Project` |
| `updateProject(entitySlug, projectId, data)` | `ProjectUpdateRequest` | `Project` |
| `deleteProject(entitySlug, projectId)` | | `void` |
| `generateProjectApiKey(entitySlug, projectId)` | | `Project` |
| `deleteProjectApiKey(entitySlug, projectId)` | | `Project` |

### Dictionary — `/entities/:entitySlug/projects/:projectId/dictionary`
| Method | Params | Returns |
|--------|--------|---------|
| `getDictionaries(entitySlug, projectId)` | | `DictionarySearchResponse[]` |
| `searchDictionary(entitySlug, projectId, languageCode, text)` | | `DictionarySearchResponse` |
| `createDictionary(entitySlug, projectId, data)` | `DictionaryCreateRequest` | `DictionarySearchResponse` |
| `updateDictionary(entitySlug, projectId, dictionaryId, data)` | `DictionaryUpdateRequest` | `DictionarySearchResponse` |
| `deleteDictionary(entitySlug, projectId, dictionaryId)` | | `DictionarySearchResponse` |

### Project Languages — `/entities/:entitySlug/projects/:projectId/languages`
| Method | Params | Returns |
|--------|--------|---------|
| `getProjectLanguages(entitySlug, projectId)` | | `ProjectLanguagesResponse` |
| `updateProjectLanguages(entitySlug, projectId, languages)` | comma-separated string | `ProjectLanguagesResponse` |

### Available Languages — `/available-languages`
| Method | Returns |
|--------|---------|
| `getAvailableLanguages()` | `AvailableLanguage[]` |

### Settings — `/users/:userId/settings`
| Method | Params | Returns |
|--------|--------|---------|
| `getSettings(userId)` | | `UserSettings` |
| `updateSettings(userId, data)` | `UserSettingsUpdateRequest` | `UserSettings` |

### Analytics — `/entities/:entitySlug/analytics`
| Method | Params | Returns |
|--------|--------|---------|
| `getAnalytics(entitySlug, startDate?, endDate?, projectId?)` | | `AnalyticsResponse` |

### Rate Limits — `/ratelimits/:entitySlug`
| Method | Params | Returns |
|--------|--------|---------|
| `getRateLimits(entitySlug, testMode?)` | | `unknown` |
| `getRateLimitHistory(entitySlug, periodType, testMode?)` | `'hour'\|'day'\|'month'` | `unknown` |

### Translation — `/translate/:orgPath/:projectName` (public, no auth)
| Method | Params | Returns |
|--------|--------|---------|
| `translate(orgPath, projectName, request, testMode?, apiKey?)` | `TranslationRequest` | `TranslationResponse` |

## TanStack Query Hooks

All hooks take `(client: WhisperlyClient, ...scopeParams)` and return TanStack Query result objects.

| Hook | Scope Params | Type | Query Key |
|------|-------------|------|-----------|
| `useProjects` | `entitySlug` | query | `whisperly-projects` |
| `useProject` | `entitySlug, projectId` | query | `whisperly-project` |
| `useGenerateApiKey` | `entitySlug` | mutation | — |
| `useDeleteApiKey` | `entitySlug` | mutation | — |
| `useDictionaries` | `entitySlug, projectId` | query | `whisperly-dictionary` |
| `useSearchDictionary` | `entitySlug, projectId` | mutation | — |
| `useProjectLanguages` | `entitySlug, projectId` | query | `whisperly-project-languages` |
| `useAvailableLanguages` | `(none)` | query | `whisperly-available-languages` |
| `useSettings` | `userId` | query | `whisperly-settings` |
| `useAnalytics` | `entitySlug, options?` | query | `whisperly-analytics` |
| `useTranslate` | `(none)` | mutation | — |

### Hook Pattern

Queries use `enabled` flag for conditional execution. Mutations call `query.refetch()` or `queryClient.invalidateQueries()` on success.

```typescript
// Query hook
export function useProjects(client: WhisperlyClient, entitySlug: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.projects, entitySlug],
    queryFn: () => client.getProjects(entitySlug),
    enabled: !!entitySlug,
  });
}
```

## Error Handling

`WhisperlyApiError` is thrown for all non-2xx responses:
```typescript
class WhisperlyApiError extends Error {
  statusCode: number;
  details?: unknown;
}
```

## Request Flow

1. `createAuthHeaders(getIdToken)` → `{ Authorization: 'Bearer ...', 'Content-Type': 'application/json' }`
2. `buildUrl(baseUrl, path)` → normalized URL
3. `fetch(url, { method, headers, body? })`
4. `handleApiResponse<T>(response)` → extracts `json.data` or throws `WhisperlyApiError`

## Adding New API Methods

1. Add method to `WhisperlyClient` class in `src/network/WhisperlyClient.ts`
2. Add QUERY_KEY to `src/types.ts` if needed
3. Create hook in `src/hooks/` following existing query/mutation patterns
4. Export from `src/hooks/index.ts` and `src/index.ts`
5. Add tests

## Dependencies

- `@sudobility/whisperly_types` — shared types
- Peer: `react`, `@tanstack/react-query`
- Dev: `firebase` (for token type)

## Build Output

- `dist/index.js` — ESM module
- `dist/index.d.ts` — Type declarations
