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
  options: UseAnalyticsOptions = {}
) {
  const { startDate, endDate, projectId, enabled = true } = options;

  return useQuery({
    queryKey: [QUERY_KEYS.analytics, startDate, endDate, projectId],
    queryFn: () => client.getAnalytics(startDate, endDate, projectId),
    enabled,
  });
}
