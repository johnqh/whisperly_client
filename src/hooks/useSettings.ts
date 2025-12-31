import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserSettingsUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

export function useSettings(client: WhisperlyClient) {
  return useQuery({
    queryKey: [QUERY_KEYS.settings],
    queryFn: () => client.getSettings(),
  });
}

export function useUpdateSettings(client: WhisperlyClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserSettingsUpdateRequest) => client.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.settings] });
    },
  });
}
