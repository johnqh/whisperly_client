import { useQuery, useMutation } from '@tanstack/react-query';
import type { DictionaryCreateRequest, DictionaryUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

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
