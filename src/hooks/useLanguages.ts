import { useQuery, useMutation } from '@tanstack/react-query';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

/**
 * Hook that fetches and manages the configured languages for a project.
 *
 * Provides the project languages query along with an update mutation
 * that automatically refetches on success.
 *
 * Query key: `[QUERY_KEYS.projectLanguages, entitySlug, projectId]`
 *
 * @param client - The WhisperlyClient instance
 * @param entitySlug - The entity/organization slug. Query is disabled when empty.
 * @param projectId - The project ID. Query is disabled when empty.
 * @returns TanStack Query result spread with `updateProjectLanguages` mutation
 *          and an `update` refetch helper
 */
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

/**
 * Hook that fetches the list of all languages supported by the Whisperly platform.
 *
 * Results are cached for 1 hour since the available languages list rarely changes.
 *
 * Query key: `[QUERY_KEYS.availableLanguages]`
 *
 * @param client - The WhisperlyClient instance
 * @returns TanStack Query result spread with an `update` refetch helper
 */
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
