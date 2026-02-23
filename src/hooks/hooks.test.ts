// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WhisperlyClient } from '../network/WhisperlyClient';
import { MockNetworkClient } from '@sudobility/di/mocks';

// Hooks under test
import { useProjects, useProject, useGenerateApiKey, useDeleteApiKey } from './useProjects';
import { useDictionaries, useSearchDictionary } from './useDictionary';
import { useProjectLanguages, useAvailableLanguages } from './useLanguages';
import { useSettings } from './useSettings';
import { useAnalytics } from './useAnalytics';
import { useTranslate } from './useTranslate';

// Test helpers
const baseUrl = 'https://api.example.com';
const apiPrefix = '/api/v1';
const entitySlug = 'my-org';
const projectId = 'proj-1';
const userId = 'user-123';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

describe('hooks', () => {
  let client: WhisperlyClient;
  let mockNetwork: MockNetworkClient;

  beforeEach(() => {
    mockNetwork = new MockNetworkClient();
    client = new WhisperlyClient({ baseUrl, networkClient: mockNetwork });
  });

  function mockGet(path: string, data: unknown) {
    mockNetwork.setMockResponse(
      `${baseUrl}${apiPrefix}${path}`,
      { data: { data }, ok: true },
      'GET'
    );
  }

  function mockPost(path: string, data: unknown) {
    mockNetwork.setMockResponse(
      `${baseUrl}${apiPrefix}${path}`,
      { data: { data }, ok: true },
      'POST'
    );
  }

  describe('useProjects', () => {
    it('should fetch projects when entitySlug is provided', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }];
      mockGet(`/entities/${entitySlug}/projects`, mockProjects);

      const { result } = renderHook(
        () => useProjects(client, entitySlug),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockProjects);
    });

    it('should not fetch when entitySlug is empty', async () => {
      const { result } = renderHook(
        () => useProjects(client, ''),
        { wrapper: createWrapper() }
      );

      // Should remain in pending state (not fetching)
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should expose createProject mutation', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }];
      mockGet(`/entities/${entitySlug}/projects`, mockProjects);
      mockPost(`/entities/${entitySlug}/projects`, { id: '2', project_name: 'new', display_name: 'New' });

      const { result } = renderHook(
        () => useProjects(client, entitySlug),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.createProject).toBeDefined();
      expect(typeof result.current.createProject.mutate).toBe('function');
    });

    it('should expose updateProject mutation', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }];
      mockGet(`/entities/${entitySlug}/projects`, mockProjects);

      const { result } = renderHook(
        () => useProjects(client, entitySlug),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.updateProject).toBeDefined();
      expect(typeof result.current.updateProject.mutate).toBe('function');
    });

    it('should expose deleteProject mutation', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }];
      mockGet(`/entities/${entitySlug}/projects`, mockProjects);

      const { result } = renderHook(
        () => useProjects(client, entitySlug),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.deleteProject).toBeDefined();
      expect(typeof result.current.deleteProject.mutate).toBe('function');
    });

    it('should expose update refetch helper', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }];
      mockGet(`/entities/${entitySlug}/projects`, mockProjects);

      const { result } = renderHook(
        () => useProjects(client, entitySlug),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(typeof result.current.update).toBe('function');
    });
  });

  describe('useProject', () => {
    it('should fetch a single project', async () => {
      const mockProject = { id: projectId, name: 'Test Project' };
      mockGet(`/entities/${entitySlug}/projects/${projectId}`, mockProject);

      const { result } = renderHook(
        () => useProject(client, entitySlug, projectId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockProject);
    });

    it('should not fetch when entitySlug is empty', () => {
      const { result } = renderHook(
        () => useProject(client, '', projectId),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should not fetch when projectId is empty', () => {
      const { result } = renderHook(
        () => useProject(client, entitySlug, ''),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useGenerateApiKey', () => {
    it('should provide a mutation for generating API keys', () => {
      const { result } = renderHook(
        () => useGenerateApiKey(client, entitySlug, projectId),
        { wrapper: createWrapper() }
      );

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
    });
  });

  describe('useDeleteApiKey', () => {
    it('should provide a mutation for deleting API keys', () => {
      const { result } = renderHook(
        () => useDeleteApiKey(client, entitySlug, projectId),
        { wrapper: createWrapper() }
      );

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
    });
  });

  describe('useDictionaries', () => {
    it('should fetch dictionaries when entitySlug and projectId are provided', async () => {
      const mockDictionaries = [
        { dictionary_id: 'd1', translations: { en: 'hello', es: 'hola' } },
      ];
      mockGet(
        `/entities/${entitySlug}/projects/${projectId}/dictionary`,
        mockDictionaries
      );

      const { result } = renderHook(
        () => useDictionaries(client, entitySlug, projectId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockDictionaries);
    });

    it('should not fetch when entitySlug is empty', () => {
      const { result } = renderHook(
        () => useDictionaries(client, '', projectId),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should not fetch when projectId is empty', () => {
      const { result } = renderHook(
        () => useDictionaries(client, entitySlug, ''),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should expose CRUD mutations', async () => {
      mockGet(
        `/entities/${entitySlug}/projects/${projectId}/dictionary`,
        []
      );

      const { result } = renderHook(
        () => useDictionaries(client, entitySlug, projectId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(typeof result.current.createDictionary.mutate).toBe('function');
      expect(typeof result.current.updateDictionary.mutate).toBe('function');
      expect(typeof result.current.deleteDictionary.mutate).toBe('function');
    });
  });

  describe('useSearchDictionary', () => {
    it('should search dictionary when all params are provided', async () => {
      const mockResult = {
        dictionary_id: 'd1',
        translations: { en: 'hello', es: 'hola' },
      };
      mockGet(
        `/entities/${entitySlug}/projects/${projectId}/dictionary/search/en/hello`,
        mockResult
      );

      const { result } = renderHook(
        () => useSearchDictionary(client, entitySlug, projectId, 'en', 'hello'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockResult);
    });

    it('should not search when text is empty', () => {
      const { result } = renderHook(
        () => useSearchDictionary(client, entitySlug, projectId, 'en', ''),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should not search when languageCode is empty', () => {
      const { result } = renderHook(
        () => useSearchDictionary(client, entitySlug, projectId, '', 'hello'),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useProjectLanguages', () => {
    it('should fetch project languages', async () => {
      const mockLanguages = { project_id: projectId, languages: 'en,es' };
      mockGet(
        `/entities/${entitySlug}/projects/${projectId}/languages`,
        mockLanguages
      );

      const { result } = renderHook(
        () => useProjectLanguages(client, entitySlug, projectId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockLanguages);
    });

    it('should not fetch when entitySlug is empty', () => {
      const { result } = renderHook(
        () => useProjectLanguages(client, '', projectId),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should expose updateProjectLanguages mutation', async () => {
      const mockLanguages = { project_id: projectId, languages: 'en,es' };
      mockGet(
        `/entities/${entitySlug}/projects/${projectId}/languages`,
        mockLanguages
      );

      const { result } = renderHook(
        () => useProjectLanguages(client, entitySlug, projectId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(typeof result.current.updateProjectLanguages.mutate).toBe('function');
    });
  });

  describe('useAvailableLanguages', () => {
    it('should fetch available languages', async () => {
      const mockLanguages = [
        { language_code: 'en', language: 'English', flag: 'us' },
        { language_code: 'es', language: 'Spanish', flag: 'es' },
      ];
      mockGet('/available-languages', mockLanguages);

      const { result } = renderHook(
        () => useAvailableLanguages(client),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockLanguages);
    });
  });

  describe('useSettings', () => {
    it('should fetch user settings when userId is provided', async () => {
      const mockSettings = { organization_name: 'Test Org' };
      mockGet(`/users/${userId}/settings`, mockSettings);

      const { result } = renderHook(
        () => useSettings(client, userId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockSettings);
    });

    it('should not fetch when userId is empty', () => {
      const { result } = renderHook(
        () => useSettings(client, ''),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should expose updateSettings mutation', async () => {
      const mockSettings = { organization_name: 'Test Org' };
      mockGet(`/users/${userId}/settings`, mockSettings);

      const { result } = renderHook(
        () => useSettings(client, userId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(typeof result.current.updateSettings.mutate).toBe('function');
    });
  });

  describe('useAnalytics', () => {
    it('should fetch analytics when entitySlug is provided', async () => {
      const mockAnalytics = { aggregate: { total_requests: 100 } };
      mockGet(`/entities/${entitySlug}/analytics`, mockAnalytics);

      const { result } = renderHook(
        () => useAnalytics(client, entitySlug),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockAnalytics);
    });

    it('should not fetch when entitySlug is empty', () => {
      const { result } = renderHook(
        () => useAnalytics(client, ''),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should not fetch when enabled option is false', () => {
      const { result } = renderHook(
        () => useAnalytics(client, entitySlug, { enabled: false }),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should fetch analytics with date filters', async () => {
      const mockAnalytics = { aggregate: { total_requests: 50 } };
      mockNetwork.setMockResponse(
        `${baseUrl}${apiPrefix}/entities/${entitySlug}/analytics?start_date=2024-01-01&end_date=2024-01-31`,
        { data: { data: mockAnalytics }, ok: true },
        'GET'
      );

      const { result } = renderHook(
        () =>
          useAnalytics(client, entitySlug, {
            startDate: '2024-01-01',
            endDate: '2024-01-31',
          }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockAnalytics);
    });
  });

  describe('useTranslate', () => {
    it('should provide a mutation for translating', () => {
      const { result } = renderHook(
        () => useTranslate(client),
        { wrapper: createWrapper() }
      );

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
    });

    it('should execute translation mutation', async () => {
      const mockResponse = {
        translations: { es: ['Hola'] },
      };
      mockPost('/translate/my-org/my-project', mockResponse);

      const { result } = renderHook(
        () => useTranslate(client),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        const response = await result.current.mutateAsync({
          orgPath: 'my-org',
          projectName: 'my-project',
          request: { strings: ['Hello'], target_languages: ['es'] },
        });
        expect(response).toEqual(mockResponse);
      });
    });
  });
});
