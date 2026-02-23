import { useQuery, useMutation } from '@tanstack/react-query';
import type { UserSettingsUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

/**
 * Hook that fetches and manages user settings.
 *
 * Provides the settings query along with an update mutation
 * that automatically refetches on success.
 *
 * Query key: `[QUERY_KEYS.settings, userId]`
 *
 * @param client - The WhisperlyClient instance
 * @param userId - The user's unique identifier (Firebase UID). Query is disabled when empty.
 * @returns TanStack Query result spread with `updateSettings` mutation
 *          and an `update` refetch helper
 */
export function useSettings(client: WhisperlyClient, userId: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.settings, userId],
    queryFn: () => client.getSettings(userId),
    enabled: !!userId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserSettingsUpdateRequest) => client.updateSettings(userId, data),
    onSuccess: () => {
      query.refetch();
    },
  });

  return {
    ...query,
    update: () => query.refetch(),
    updateSettings: updateMutation,
  };
}
