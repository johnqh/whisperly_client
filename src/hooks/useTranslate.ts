import { useMutation } from '@tanstack/react-query';
import type { TranslationRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';

/**
 * Hook that provides a mutation for translating strings via the Whisperly API.
 *
 * This is a mutation (not a query) since translations are on-demand operations,
 * not cached data fetches.
 *
 * @param client - The WhisperlyClient instance
 * @param testMode - When true, translations use test mode and do not count against rate limits.
 *                   Defaults to `false`.
 * @returns TanStack mutation result. Call `mutate()` or `mutateAsync()` with
 *          `{ orgPath, projectName, request, apiKey? }` to trigger a translation.
 */
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
