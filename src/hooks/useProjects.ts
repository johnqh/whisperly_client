import { useQuery, useMutation } from '@tanstack/react-query';
import type { ProjectCreateRequest, ProjectUpdateRequest } from '@sudobility/whisperly_types';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS } from '../types';

/**
 * Hook that fetches and manages the list of projects for an entity.
 *
 * Provides the projects query along with create, update, and delete mutations
 * that automatically refetch the projects list on success.
 *
 * Query key: `[QUERY_KEYS.projects, entitySlug]`
 *
 * @param client - The WhisperlyClient instance
 * @param entitySlug - The entity/organization slug. Query is disabled when empty.
 * @returns TanStack Query result spread with `createProject`, `updateProject`,
 *          `deleteProject` mutations and an `update` refetch helper
 */
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

/**
 * Hook that fetches a single project by ID.
 *
 * Query key: `[QUERY_KEYS.project, entitySlug, projectId]`
 *
 * @param client - The WhisperlyClient instance
 * @param entitySlug - The entity/organization slug. Query is disabled when empty.
 * @param projectId - The project ID to fetch. Query is disabled when empty.
 * @returns TanStack Query result spread with an `update` refetch helper
 */
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

/**
 * Hook that provides a mutation to generate an API key for a project.
 *
 * @param client - The WhisperlyClient instance
 * @param entitySlug - The entity/organization slug
 * @param projectId - The project to generate an API key for
 * @returns TanStack mutation result for generating the API key
 */
export function useGenerateApiKey(client: WhisperlyClient, entitySlug: string, projectId: string) {
  return useMutation({
    mutationFn: () => client.generateProjectApiKey(entitySlug, projectId),
  });
}

/**
 * Hook that provides a mutation to delete a project's API key.
 *
 * @param client - The WhisperlyClient instance
 * @param entitySlug - The entity/organization slug
 * @param projectId - The project whose API key should be deleted
 * @returns TanStack mutation result for deleting the API key
 */
export function useDeleteApiKey(client: WhisperlyClient, entitySlug: string, projectId: string) {
  return useMutation({
    mutationFn: () => client.deleteProjectApiKey(entitySlug, projectId),
  });
}
