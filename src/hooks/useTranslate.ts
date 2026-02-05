import { useMutation } from '@tanstack/react-query';
import type { TranslationRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';

export function useTranslate(client: WhisperlyClient, testMode: boolean = false) {
  return useMutation({
    mutationFn: ({
      orgPath,
      projectName,
      request,
      apiKey,
    }: {
      orgPath: string;
      projectName: string;
      request: TranslationRequest;
      apiKey?: string;
    }) => client.translate(orgPath, projectName, request, testMode, apiKey),
  });
}
