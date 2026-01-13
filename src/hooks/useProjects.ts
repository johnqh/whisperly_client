import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProjectCreateRequest, ProjectUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

export function useProjects(client: WhisperlyClient, entitySlug: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.projects, entitySlug],
    queryFn: () => client.getProjects(entitySlug),
    enabled: !!entitySlug,
  });
}

export function useProject(client: WhisperlyClient, entitySlug: string, projectId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.project, entitySlug, projectId],
    queryFn: () => client.getProject(entitySlug, projectId),
    enabled: !!entitySlug && !!projectId,
  });
}

export function useCreateProject(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectCreateRequest) => client.createProject(entitySlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects, entitySlug] });
    },
  });
}

export function useUpdateProject(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: ProjectUpdateRequest;
    }) => client.updateProject(entitySlug, projectId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects, entitySlug] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.project, entitySlug, variables.projectId],
      });
    },
  });
}

export function useDeleteProject(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => client.deleteProject(entitySlug, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects, entitySlug] });
    },
  });
}
