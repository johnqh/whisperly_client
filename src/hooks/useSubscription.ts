import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

export function useSubscription(client: WhisperlyClient) {
  return useQuery({
    queryKey: [QUERY_KEYS.subscription],
    queryFn: () => client.getSubscription(),
  });
}

export function useSyncSubscription(client: WhisperlyClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => client.syncSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.subscription] });
    },
  });
}
