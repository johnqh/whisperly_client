import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GlossaryCreateRequest, GlossaryUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

export function useGlossaries(
  client: WhisperlyClient,
  entitySlug: string,
  projectId: string
) {
  return useQuery({
    queryKey: [QUERY_KEYS.glossaries, entitySlug, projectId],
    queryFn: () => client.getGlossaries(entitySlug, projectId),
    enabled: !!entitySlug && !!projectId,
  });
}

export function useGlossary(
  client: WhisperlyClient,
  entitySlug: string,
  projectId: string,
  glossaryId: string
) {
  return useQuery({
    queryKey: [QUERY_KEYS.glossary, entitySlug, projectId, glossaryId],
    queryFn: () => client.getGlossary(entitySlug, projectId, glossaryId),
    enabled: !!entitySlug && !!projectId && !!glossaryId,
  });
}

export function useCreateGlossary(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: GlossaryCreateRequest;
    }) => client.createGlossary(entitySlug, projectId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.glossaries, entitySlug, variables.projectId],
      });
    },
  });
}

export function useUpdateGlossary(client: WhisperlyClient, entitySlug: string) {
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
    }) => client.updateGlossary(entitySlug, projectId, glossaryId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.glossaries, entitySlug, variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.glossary,
          entitySlug,
          variables.projectId,
          variables.glossaryId,
        ],
      });
    },
  });
}

export function useDeleteGlossary(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      glossaryId,
    }: {
      projectId: string;
      glossaryId: string;
    }) => client.deleteGlossary(entitySlug, projectId, glossaryId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.glossaries, entitySlug, variables.projectId],
      });
    },
  });
}

export function useImportGlossaries(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      glossaries,
    }: {
      projectId: string;
      glossaries: GlossaryCreateRequest[];
    }) => client.importGlossaries(entitySlug, projectId, glossaries),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.glossaries, entitySlug, variables.projectId],
      });
    },
  });
}

export function useExportGlossaries(client: WhisperlyClient, entitySlug: string) {
  return useMutation({
    mutationFn: ({
      projectId,
      format,
    }: {
      projectId: string;
      format?: 'json' | 'csv';
    }) => client.exportGlossaries(entitySlug, projectId, format),
  });
}
