import { useQuery, useMutation } from '@tanstack/react-query';
import type { ProjectCreateRequest, ProjectUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

export function useProjects(client: WhisperlyClient, entitySlug: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.projects, entitySlug],
    queryFn: () => client.getProjects(entitySlug),
    enabled: !!entitySlug,
  });

  const createMutation = useMutation({
    mutationFn: (data: ProjectCreateRequest) => client.createProject(entitySlug, data),
    onSuccess: () => {
      query.refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: ProjectUpdateRequest;
    }) => client.updateProject(entitySlug, projectId, data),
    onSuccess: () => {
      query.refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => client.deleteProject(entitySlug, projectId),
    onSuccess: () => {
      query.refetch();
    },
  });

  return {
    ...query,
    update: () => query.refetch(),
    createProject: createMutation,
    updateProject: updateMutation,
    deleteProject: deleteMutation,
  };
}

export function useProject(client: WhisperlyClient, entitySlug: string, projectId: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.project, entitySlug, projectId],
    queryFn: () => client.getProject(entitySlug, projectId),
    enabled: !!entitySlug && !!projectId,
  });

  return {
    ...query,
    update: () => query.refetch(),
  };
}
