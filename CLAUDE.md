# CLAUDE.md - whisperly_client

## Project Overview
`@sudobility/whisperly_client` is a React client library for the Whisperly API. It provides a typed API client class and TanStack Query hooks for seamless data fetching and mutations in React applications.

## Platform Support
- **Web App**: Yes
- **React Native**: Yes
- **Backend (Node.js/Bun)**: No (client-side only)

This library is designed to work in both web and React Native environments. Tests use node environment to ensure no DOM-specific APIs are used.

## Tech Stack
- **Runtime**: Bun
- **Language**: TypeScript 5.9+
- **React**: 19.x (peer dependency)
- **Data Fetching**: TanStack Query 5.x (peer dependency)
- **Auth**: Firebase (for ID token retrieval)
- **Testing**: Vitest
- **Linting**: ESLint 9 with TypeScript + React plugins

## Package Manager
**IMPORTANT**: This project uses **Bun**, not npm or yarn.
- Install dependencies: `bun install`
- Run scripts: `bun run <script>`
- Add dependencies: `bun add <package>` or `bun add -d <package>` for dev

## Project Structure
```
src/
├── index.ts                    # Main barrel export
├── types.ts                    # Client-specific types (QUERY_KEYS, Endpoint types, etc.)
├── types.test.ts               # Types tests
├── network/
│   ├── WhisperlyClient.ts      # Main API client class
│   └── WhisperlyClient.test.ts # Client tests
├── hooks/
│   ├── index.ts                # Hooks barrel export
│   ├── useProjects.ts          # Project queries/mutations (entity-scoped)
│   ├── useEndpoints.ts         # Endpoint queries/mutations (project-scoped)
│   ├── useGlossaries.ts        # Glossary queries/mutations (project-scoped)
│   ├── useSettings.ts          # Settings queries/mutations (user-scoped)
│   ├── useAnalytics.ts         # Analytics query (entity-scoped)
│   ├── useSubscription.ts      # Subscription queries/mutations (user-scoped)
│   └── useTranslate.ts         # Translation mutation (public endpoint)
└── utils/
    ├── whisperly-helpers.ts      # API utilities
    └── whisperly-helpers.test.ts # Utility tests
```

## Key Scripts
```bash
bun run build        # Build TypeScript to dist/
bun run build:watch  # Build in watch mode
bun run typecheck    # Run TypeScript type checking
bun run lint         # Run ESLint
bun run test         # Run tests in watch mode
bun run test:run     # Run tests once
```

## Usage

### Initialize Client
```typescript
import { WhisperlyClient } from '@sudobility/whisperly_client';

const client = new WhisperlyClient({
  baseUrl: 'https://api.whisperly.com',
  getIdToken: () => firebaseUser.getIdToken(),
});
```

### Use TanStack Query Hooks
```typescript
import { useProjects, useCreateProject, useEndpoints } from '@sudobility/whisperly_client';

function MyComponent({ entitySlug, projectId }) {
  // Entity-scoped hooks require entitySlug
  const { data: projects, isLoading } = useProjects(client, entitySlug);
  const createProject = useCreateProject(client, entitySlug);

  // Project-scoped hooks require entitySlug and projectId
  const { data: endpoints } = useEndpoints(client, entitySlug, projectId);

  const handleCreate = () => {
    createProject.mutate({ project_name: 'new-project', display_name: 'New Project' });
  };
}
```

## API Structure (Entity-Centric)

The API uses an entity-centric structure where resources belong to entities (organizations):

### Routes Overview
- **Entity-scoped**: `/entities/:entitySlug/...` - Projects, endpoints, glossaries, analytics
- **User-scoped**: `/users/:userId/...` - Settings, subscription
- **Public**: `/translate/:orgPath/:projectName/:endpointName` - Translation requests

## API Client Methods

### Projects (Entity-scoped)
- `getProjects(entitySlug)` - List all projects for entity
- `getProject(entitySlug, projectId)` - Get single project
- `createProject(entitySlug, data)` - Create project
- `updateProject(entitySlug, projectId, data)` - Update project
- `deleteProject(entitySlug, projectId)` - Delete project

### Endpoints (Project-scoped)
- `getEndpoints(entitySlug, projectId)` - List endpoints for project
- `getEndpoint(entitySlug, projectId, endpointId)` - Get single endpoint
- `createEndpoint(entitySlug, projectId, data)` - Create endpoint
- `updateEndpoint(entitySlug, projectId, endpointId, data)` - Update endpoint
- `deleteEndpoint(entitySlug, projectId, endpointId)` - Delete endpoint

### Glossaries (Project-scoped)
- `getGlossaries(entitySlug, projectId)` - List glossaries for project
- `getGlossary(entitySlug, projectId, glossaryId)` - Get single glossary
- `createGlossary(entitySlug, projectId, data)` - Create glossary
- `updateGlossary(entitySlug, projectId, glossaryId, data)` - Update glossary
- `deleteGlossary(entitySlug, projectId, glossaryId)` - Delete glossary
- `importGlossaries(entitySlug, projectId, glossaries[])` - Bulk import
- `exportGlossaries(entitySlug, projectId, format)` - Export as JSON/CSV

### Analytics (Entity-scoped)
- `getAnalytics(entitySlug, startDate?, endDate?, projectId?)` - Get usage analytics

### Settings (User-scoped)
- `getSettings(userId)` - Get user settings
- `updateSettings(userId, data)` - Update user settings

### Subscription (User-scoped)
- `getSubscription(userId)` - Get subscription status
- `syncSubscription(userId)` - Sync subscription with RevenueCat

### Rate Limits (Entity-scoped)
- `getRateLimits(entitySlug, testMode?)` - Get rate limit status
- `getRateLimitHistory(entitySlug, periodType, testMode?)` - Get rate limit history

### Translation (Public)
- `translate(orgPath, projectName, endpointName, request)` - Send translation request

## Query Keys
The `QUERY_KEYS` constant provides consistent cache keys:
```typescript
import { QUERY_KEYS } from '@sudobility/whisperly_client';

// QUERY_KEYS.projects = 'whisperly-projects'
// QUERY_KEYS.endpoints = 'whisperly-endpoints'
// QUERY_KEYS.glossaries = 'whisperly-glossaries'
// QUERY_KEYS.rateLimits = 'whisperly-rate-limits'
// etc.
```

## Development Guidelines

### Adding New Hooks
1. Create hook file in `src/hooks/`
2. Use `QUERY_KEYS` for cache key consistency
3. Include entitySlug/userId in query keys for proper cache scoping
4. Export from `src/hooks/index.ts`
5. Re-export from `src/index.ts`

### Hook Pattern (Entity-scoped)
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../types';

export function useProjects(client: WhisperlyClient, entitySlug: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.projects, entitySlug],
    queryFn: () => client.getProjects(entitySlug),
    enabled: !!entitySlug,
  });
}

export function useCreateProject(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => client.createProject(entitySlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects, entitySlug] });
    },
  });
}
```

### Error Handling
The client throws `WhisperlyApiError` for API errors:
```typescript
try {
  await client.getProjects(entitySlug);
} catch (error) {
  if (error instanceof WhisperlyApiError) {
    console.log(error.statusCode, error.details);
  }
}
```

## Dependencies
- `@sudobility/whisperly_types` - Shared types
- Peer: `react`, `@tanstack/react-query`

## Build Output
- `dist/index.js` - ESM module
- `dist/index.d.ts` - Type declarations
