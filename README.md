# @sudobility/whisperly_client

Typed API client and TanStack Query hooks for the Whisperly localization platform.

## Installation

```bash
bun add @sudobility/whisperly_client
```

## Usage

```typescript
import { WhisperlyClient, useProjects, useTranslate } from "@sudobility/whisperly_client";

const client = new WhisperlyClient({ baseUrl, getIdToken });

// Direct client usage
const projects = await client.getProjects(entitySlug);

// React hook usage
const { data: projects } = useProjects(client, entitySlug);
```

## API

### WhisperlyClient Methods

- **Projects**: `getProjects`, `createProject`, `updateProject`, `deleteProject`, `generateProjectApiKey`
- **Dictionary**: `getDictionaries`, `searchDictionary`, `createDictionary`, `updateDictionary`, `deleteDictionary`
- **Translation**: `translate` (public, no auth required)
- **Analytics**: `getAnalytics`
- **Settings**: `getSettings`, `updateSettings`
- **Languages**: `getProjectLanguages`, `getAvailableLanguages`

### TanStack Query Hooks

`useProjects`, `useProject`, `useDictionaries`, `useSearchDictionary`, `useProjectLanguages`, `useAvailableLanguages`, `useSettings`, `useAnalytics`, `useTranslate`, `useGenerateApiKey`, `useDeleteApiKey`

## Development

```bash
bun run build        # Build ESM
bun run test:run     # Run tests once
bun run verify       # All checks + build
```

## Related Packages

- `whisperly_types` -- Shared type definitions
- `whisperly_lib` -- Business logic with Zustand stores
- `whisperly_api` -- Backend API server
- `whisperly_app` -- Web application

## License

BUSL-1.1
