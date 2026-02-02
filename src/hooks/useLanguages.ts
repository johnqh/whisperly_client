import { useQuery, useMutation } from '@tanstack/react-query';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

export function useProjectLanguages(
  client: WhisperlyClient,
  entitySlug: string,
  projectId: string
) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.projectLanguages, entitySlug, projectId],
    queryFn: () => client.getProjectLanguages(entitySlug, projectId),
    enabled: !!entitySlug && !!projectId,
  });

  const updateMutation = useMutation({
    mutationFn: (languages: string) =>
      client.updateProjectLanguages(entitySlug, projectId, languages),
    onSuccess: () => {
      query.refetch();
    },
  });

  return {
    ...query,
    update: () => query.refetch(),
    updateProjectLanguages: updateMutation,
  };
}

export function useAvailableLanguages(client: WhisperlyClient) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.availableLanguages],
    queryFn: () => client.getAvailableLanguages(),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since this rarely changes
  });

  return {
    ...query,
    update: () => query.refetch(),
  };
}
