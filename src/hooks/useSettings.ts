import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserSettingsUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

export function useSettings(client: WhisperlyClient, userId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.settings, userId],
    queryFn: () => client.getSettings(userId),
    enabled: !!userId,
  });
}

export function useUpdateSettings(client: WhisperlyClient, userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserSettingsUpdateRequest) => client.updateSettings(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.settings, userId] });
    },
  });
}
