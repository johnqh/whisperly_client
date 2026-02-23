import { useQuery } from '@tanstack/react-query';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

/**
 * Options for the {@link useAnalytics} hook.
 */
export interface UseAnalyticsOptions {
  /** Start date filter in ISO 8601 format (e.g., "2024-01-01"). */
  startDate?: string;
  /** End date filter in ISO 8601 format (e.g., "2024-01-31"). */
  endDate?: string;
  /** Filter analytics to a specific project by ID. */
  projectId?: string;
  /** Whether the query is enabled. Defaults to `true`. */
  enabled?: boolean;
}

/**
 * Hook that fetches analytics data for an entity with optional date and project filters.
 *
 * Query key: `[QUERY_KEYS.analytics, entitySlug, startDate, endDate, projectId]`
 *
 * @param client - The WhisperlyClient instance
 * @param entitySlug - The entity/organization slug. Query is disabled when empty.
 * @param options - Optional filters for date range, project, and query enabled state
 * @returns TanStack Query result spread with an `update` refetch helper
 */
export function useAnalytics(
  client: WhisperlyClient,
  entitySlug: string,
  options: UseAnalyticsOptions = {}
) {
  const { startDate, endDate, projectId, enabled = true } = options;

  const query = useQuery({
    queryKey: [QUERY_KEYS.analytics, entitySlug, startDate, endDate, projectId],
    queryFn: () => client.getAnalytics(entitySlug, startDate, endDate, projectId),
    enabled: enabled && !!entitySlug,
  });

  return {
    ...query,
    update: () => query.refetch(),
  };
}
