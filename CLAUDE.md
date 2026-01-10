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
├── types.ts                    # Client-specific types (QUERY_KEYS, etc.)
├── types.test.ts               # Types tests
├── network/
│   ├── WhisperlyClient.ts      # Main API client class
│   └── WhisperlyClient.test.ts # Client tests
├── hooks/
│   ├── index.ts                # Hooks barrel export
│   ├── useProjects.ts          # Project queries/mutations
│   ├── useGlossaries.ts        # Glossary queries/mutations
│   ├── useSettings.ts          # Settings queries/mutations
│   ├── useAnalytics.ts         # Analytics query
│   ├── useSubscription.ts      # Subscription queries/mutations
│   └── useTranslate.ts         # Translation mutation
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
import { useProjects, useCreateProject } from '@sudobility/whisperly_client';

function MyComponent() {
  const { data: projects, isLoading } = useProjects(client);
  const createProject = useCreateProject(client);

  const handleCreate = () => {
    createProject.mutate({ project_name: 'new-project', display_name: 'New Project' });
  };
}
```

## API Client Methods

### Projects
- `getProjects()` - List all projects
- `getProject(projectId)` - Get single project
- `createProject(data)` - Create project
- `updateProject(projectId, data)` - Update project
- `deleteProject(projectId)` - Delete project

### Glossaries
- `getGlossaries(projectId)` - List glossaries for project
- `getGlossary(projectId, glossaryId)` - Get single glossary
- `createGlossary(projectId, data)` - Create glossary
- `updateGlossary(projectId, glossaryId, data)` - Update glossary
- `deleteGlossary(projectId, glossaryId)` - Delete glossary
- `importGlossaries(projectId, glossaries[])` - Bulk import
- `exportGlossaries(projectId, format)` - Export as JSON/CSV

### Settings, Analytics, Subscription, Translation
- `getSettings()` / `updateSettings(data)`
- `getAnalytics(startDate?, endDate?, projectId?)`
- `getSubscription()` / `syncSubscription()`
- `translate(projectId, request)`

## Query Keys
The `QUERY_KEYS` constant provides consistent cache keys:
```typescript
import { QUERY_KEYS } from '@sudobility/whisperly_client';

// QUERY_KEYS.projects = 'whisperly-projects'
// QUERY_KEYS.glossaries = 'whisperly-glossaries'
// etc.
```

## Development Guidelines

### Adding New Hooks
1. Create hook file in `src/hooks/`
2. Use `QUERY_KEYS` for cache key consistency
3. Export from `src/hooks/index.ts`
4. Re-export from `src/index.ts`

### Hook Pattern
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../types';

export function useProjects(client: WhisperlyClient) {
  return useQuery({
    queryKey: [QUERY_KEYS.projects],
    queryFn: () => client.getProjects(),
  });
}

export function useCreateProject(client: WhisperlyClient) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => client.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
    },
  });
}
```

### Error Handling
The client throws `WhisperlyApiError` for API errors:
```typescript
try {
  await client.getProjects();
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
