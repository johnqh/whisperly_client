import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { QUERY_KEYS, EndpointCreateRequest, EndpointUpdateRequest } from '../types';

export function useEndpoints(
  client: WhisperlyClient,
  entitySlug: string,
  projectId: string
) {
  return useQuery({
    queryKey: [QUERY_KEYS.endpoints, entitySlug, projectId],
    queryFn: () => client.getEndpoints(entitySlug, projectId),
    enabled: !!entitySlug && !!projectId,
  });
}

export function useEndpoint(
  client: WhisperlyClient,
  entitySlug: string,
  projectId: string,
  endpointId: string
) {
  return useQuery({
    queryKey: [QUERY_KEYS.endpoint, entitySlug, projectId, endpointId],
    queryFn: () => client.getEndpoint(entitySlug, projectId, endpointId),
    enabled: !!entitySlug && !!projectId && !!endpointId,
  });
}

export function useCreateEndpoint(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: EndpointCreateRequest;
    }) => client.createEndpoint(entitySlug, projectId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.endpoints, entitySlug, variables.projectId],
      });
    },
  });
}

export function useUpdateEndpoint(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      endpointId,
      data,
    }: {
      projectId: string;
      endpointId: string;
      data: EndpointUpdateRequest;
    }) => client.updateEndpoint(entitySlug, projectId, endpointId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.endpoints, entitySlug, variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.endpoint,
          entitySlug,
          variables.projectId,
          variables.endpointId,
        ],
      });
    },
  });
}

export function useDeleteEndpoint(client: WhisperlyClient, entitySlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      endpointId,
    }: {
      projectId: string;
      endpointId: string;
    }) => client.deleteEndpoint(entitySlug, projectId, endpointId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.endpoints, entitySlug, variables.projectId],
      });
    },
  });
}
