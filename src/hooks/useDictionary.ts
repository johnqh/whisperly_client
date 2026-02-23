import { useQuery, useMutation } from '@tanstack/react-query';
import type { DictionaryCreateRequest, DictionaryUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

/**
 * Hook that fetches and manages dictionary entries for a project.
 *
 * Provides the dictionaries query along with create, update, and delete mutations
 * that automatically refetch the dictionary list on success.
 *
 * Query key: `[QUERY_KEYS.dictionary, entitySlug, projectId]`
 *
 * @param client - The WhisperlyClient instance
 * @param entitySlug - The entity/organization slug. Query is disabled when empty.
 * @param projectId - The project ID. Query is disabled when empty.
 * @returns TanStack Query result spread with `createDictionary`, `updateDictionary`,
 *          `deleteDictionary` mutations and an `update` refetch helper
 */
export function useDictionaries(
  client: WhisperlyClient,
  entitySlug: string,
  projectId: string
) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.dictionary, entitySlug, projectId],
    queryFn: () => client.getDictionaries(entitySlug, projectId),
    enabled: !!entitySlug && !!projectId,
  });

  const createMutation = useMutation({
    mutationFn: (data: DictionaryCreateRequest) =>
      client.createDictionary(entitySlug, projectId, data),
    onSuccess: () => {
      query.refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      dictionaryId,
      data,
    }: {
      dictionaryId: string;
      data: DictionaryUpdateRequest;
    }) => client.updateDictionary(entitySlug, projectId, dictionaryId, data),
    onSuccess: () => {
      query.refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (dictionaryId: string) =>
      client.deleteDictionary(entitySlug, projectId, dictionaryId),
    onSuccess: () => {
      query.refetch();
    },
  });

  return {
    ...query,
    update: () => query.refetch(),
    createDictionary: createMutation,
    updateDictionary: updateMutation,
    deleteDictionary: deleteMutation,
  };
}

/**
 * Hook that searches the project dictionary for a specific term.
 *
 * Query key: `[QUERY_KEYS.dictionarySearch, entitySlug, projectId, languageCode, text]`
 *
 * @param client - The WhisperlyClient instance
 * @param entitySlug - The entity/organization slug. Query is disabled when empty.
 * @param projectId - The project ID. Query is disabled when empty.
 * @param languageCode - The language code to search in (e.g., "en"). Query is disabled when empty.
 * @param text - The text to search for. Query is disabled when empty.
 * @returns TanStack Query result spread with an `update` refetch helper
 */
export function useSearchDictionary(
  client: WhisperlyClient,
  entitySlug: string,
  projectId: string,
  languageCode: string,
  text: string
) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.dictionarySearch, entitySlug, projectId, languageCode, text],
    queryFn: () => client.searchDictionary(entitySlug, projectId, languageCode, text),
    enabled: !!entitySlug && !!projectId && !!languageCode && !!text,
  });

  return {
    ...query,
    update: () => query.refetch(),
  };
}
