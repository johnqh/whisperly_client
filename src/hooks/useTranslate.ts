import { useMutation } from '@tanstack/react-query';
import type { TranslationRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';

export function useTranslate(client: WhisperlyClient) {
  return useMutation({
    mutationFn: ({
      projectId,
      request,
    }: {
      projectId: string;
      request: TranslationRequest;
    }) => client.translate(projectId, request),
  });
}
