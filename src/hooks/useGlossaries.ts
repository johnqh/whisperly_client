import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GlossaryCreateRequest, GlossaryUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

export function useGlossaries(client: WhisperlyClient, projectId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.glossaries, projectId],
    queryFn: () => client.getGlossaries(projectId),
    enabled: !!projectId,
  });
}

export function useGlossary(
  client: WhisperlyClient,
  projectId: string,
  glossaryId: string
) {
  return useQuery({
    queryKey: [QUERY_KEYS.glossary, projectId, glossaryId],
    queryFn: () => client.getGlossary(projectId, glossaryId),
    enabled: !!projectId && !!glossaryId,
  });
}

export function useCreateGlossary(client: WhisperlyClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: GlossaryCreateRequest;
    }) => client.createGlossary(projectId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.glossaries, variables.projectId],
      });
    },
  });
}

export function useUpdateGlossary(client: WhisperlyClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      glossaryId,
      data,
    }: {
      projectId: string;
      glossaryId: string;
      data: GlossaryUpdateRequest;
    }) => client.updateGlossary(projectId, glossaryId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.glossaries, variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.glossary,
          variables.projectId,
          variables.glossaryId,
        ],
      });
    },
  });
}

export function useDeleteGlossary(client: WhisperlyClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      glossaryId,
    }: {
      projectId: string;
      glossaryId: string;
    }) => client.deleteGlossary(projectId, glossaryId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.glossaries, variables.projectId],
      });
    },
  });
}

export function useImportGlossaries(client: WhisperlyClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      glossaries,
    }: {
      projectId: string;
      glossaries: GlossaryCreateRequest[];
    }) => client.importGlossaries(projectId, glossaries),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.glossaries, variables.projectId],
      });
    },
  });
}

export function useExportGlossaries(client: WhisperlyClient) {
  return useMutation({
    mutationFn: ({
      projectId,
      format,
    }: {
      projectId: string;
      format?: 'json' | 'csv';
    }) => client.exportGlossaries(projectId, format),
  });
}
