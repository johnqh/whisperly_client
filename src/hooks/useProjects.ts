import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProjectCreateRequest, ProjectUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

export function useProjects(client: WhisperlyClient) {
  return useQuery({
    queryKey: [QUERY_KEYS.projects],
    queryFn: () => client.getProjects(),
  });
}

export function useProject(client: WhisperlyClient, projectId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.project, projectId],
    queryFn: () => client.getProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProject(client: WhisperlyClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectCreateRequest) => client.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
    },
  });
}

export function useUpdateProject(client: WhisperlyClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: ProjectUpdateRequest;
    }) => client.updateProject(projectId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.project, variables.projectId],
      });
    },
  });
}

export function useDeleteProject(client: WhisperlyClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => client.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
    },
  });
}
