import { useQuery } from '@tanstack/react-query';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

export interface UseAnalyticsOptions {
  startDate?: string;
  endDate?: string;
  projectId?: string;
  enabled?: boolean;
}

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
