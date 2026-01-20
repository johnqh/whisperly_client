import { useMutation } from '@tanstack/react-query';
import type { TranslationRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';

export function useTranslate(client: WhisperlyClient) {
  return useMutation({
    mutationFn: ({
      orgPath,
      projectName,
      request,
    }: {
      orgPath: string;
      projectName: string;
      request: TranslationRequest;
    }) => client.translate(orgPath, projectName, request),
  });
}
