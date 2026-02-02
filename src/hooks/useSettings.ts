import { useQuery, useMutation } from '@tanstack/react-query';
import type { UserSettingsUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

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
