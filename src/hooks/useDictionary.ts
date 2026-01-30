import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DictionaryCreateRequest, DictionaryUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

export function useDictionaries(
  client: WhisperlyClient,
  entitySlug: string,
  projectId: string
) {
  return useQuery({
    queryKey: [QUERY_KEYS.dictionary, entitySlug, projectId],
    queryFn: () => client.getDictionaries(entitySlug, projectId),
    enabled: !!entitySlug && !!projectId,
  });
}

export function useSearchDictionary(
  client: WhisperlyClient,
  entitySlug: string,
  projectId: string,
  languageCode: string,
  text: string
) {
  return useQuery({
    queryKey: [QUERY_KEYS.dictionarySearch, entitySlug, projectId, languageCode, text],
    queryFn: () => client.searchDictionary(entitySlug, projectId, languageCode, text),
    enabled: !!entitySlug && !!projectId && !!languageCode && !!text,
  });
}

export function useCreateDictionary(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: DictionaryCreateRequest;
    }) => client.createDictionary(entitySlug, projectId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.dictionary, entitySlug, variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.dictionarySearch, entitySlug, variables.projectId],
      });
    },
  });
}

export function useUpdateDictionary(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      dictionaryId,
      data,
    }: {
      projectId: string;
      dictionaryId: string;
      data: DictionaryUpdateRequest;
    }) => client.updateDictionary(entitySlug, projectId, dictionaryId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.dictionary, entitySlug, variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.dictionarySearch, entitySlug, variables.projectId],
      });
    },
  });
}

export function useDeleteDictionary(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      dictionaryId,
    }: {
      projectId: string;
      dictionaryId: string;
    }) => client.deleteDictionary(entitySlug, projectId, dictionaryId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.dictionary, entitySlug, variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.dictionarySearch, entitySlug, variables.projectId],
      });
    },
  });
}
