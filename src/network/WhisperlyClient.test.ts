import { describe, it, expect, beforeEach } from 'vitest';
import { MockNetworkClient } from '@sudobility/di/mocks';
import { WhisperlyClient } from './WhisperlyClient';

describe('WhisperlyClient', () => {
  let client: WhisperlyClient;
  let mockNetwork: MockNetworkClient;
  const baseUrl = 'https://api.example.com';
  const apiPrefix = '/api/v1';
  const entitySlug = 'my-org';
  const userId = 'user-123';
  const projectId = 'proj-1';

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

  function mockPut(path: string, data: unknown) {
    mockNetwork.setMockResponse(
      `${baseUrl}${apiPrefix}${path}`,
      { data: { data }, ok: true },
      'PUT'
    );
  }

  function mockDelete(path: string, data?: unknown) {
    mockNetwork.setMockResponse(
      `${baseUrl}${apiPrefix}${path}`,
      { data: data ? { data } : undefined, ok: true },
      'DELETE'
    );
  }

  describe('constructor', () => {
    it('should create an instance with config', () => {
      expect(client).toBeInstanceOf(WhisperlyClient);
    });
  });

  describe('Projects', () => {
    describe('getProjects', () => {
      it('should fetch projects', async () => {
        const mockProjects = [{ id: '1', name: 'Project 1' }];
        mockGet(`/entities/${entitySlug}/projects`, mockProjects);

        const result = await client.getProjects(entitySlug);

        expect(
          mockNetwork.wasUrlCalled(
            `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects`,
            'GET'
          )
        ).toBe(true);
        expect(result).toEqual(mockProjects);
      });
    });

    describe('getProject', () => {
      it('should fetch a single project by id', async () => {
        const mockProject = { id: 'proj-1', name: 'Test Project' };
        mockGet(`/entities/${entitySlug}/projects/${projectId}`, mockProject);

        const result = await client.getProject(entitySlug, projectId);

        expect(result).toEqual(mockProject);
      });
    });

    describe('createProject', () => {
      it('should create a project with POST request', async () => {
        const createData = {
          project_name: 'new-project',
          display_name: 'New Project',
        };
        const mockProject = { id: 'new-1', ...createData };
        mockPost(`/entities/${entitySlug}/projects`, mockProject);

        const result = await client.createProject(entitySlug, createData);

        expect(result).toEqual(mockProject);
        const lastRequest = mockNetwork.getLastRequest();
        expect(lastRequest?.method).toBe('POST');
      });
    });

    describe('updateProject', () => {
      it('should update a project with PUT request', async () => {
        const updateData = { display_name: 'Updated Project' };
        const mockProject = { id: 'proj-1', display_name: 'Updated Project' };
        mockPut(
          `/entities/${entitySlug}/projects/${projectId}`,
          mockProject
        );

        const result = await client.updateProject(
          entitySlug,
          projectId,
          updateData
        );

        expect(result).toEqual(mockProject);
        const lastRequest = mockNetwork.getLastRequest();
        expect(lastRequest?.method).toBe('PUT');
      });
    });

    describe('deleteProject', () => {
      it('should delete a project with DELETE request', async () => {
        mockDelete(`/entities/${entitySlug}/projects/${projectId}`);

        await client.deleteProject(entitySlug, projectId);

        expect(
          mockNetwork.wasUrlCalled(
            `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects/${projectId}`,
            'DELETE'
          )
        ).toBe(true);
      });

      it('should throw error when delete fails', async () => {
        mockNetwork.setMockResponse(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects/${projectId}`,
          { ok: false, status: 404, statusText: 'Not Found' },
          'DELETE'
        );

        await expect(
          client.deleteProject(entitySlug, projectId)
        ).rejects.toThrow('Failed to delete project: Not Found');
      });
    });
  });

  describe('Dictionary', () => {
    const dictionaryId = 'd1';

    describe('searchDictionary', () => {
      it('should search dictionary by language code and text', async () => {
        const mockResult = {
          dictionary_id: 'd1',
          translations: { en: 'hello', es: 'hola' },
        };
        mockGet(
          `/entities/${entitySlug}/projects/${projectId}/dictionary/search/en/hello`,
          mockResult
        );

        const result = await client.searchDictionary(
          entitySlug,
          projectId,
          'en',
          'hello'
        );

        expect(result).toEqual(mockResult);
      });
    });

    describe('createDictionary', () => {
      it('should create a dictionary entry', async () => {
        const createData = { en: 'hello', es: 'hola' };
        const mockResult = {
          dictionary_id: 'd1',
          translations: createData,
        };
        mockPost(
          `/entities/${entitySlug}/projects/${projectId}/dictionary`,
          mockResult
        );

        const result = await client.createDictionary(
          entitySlug,
          projectId,
          createData
        );

        expect(result).toEqual(mockResult);
      });
    });

    describe('updateDictionary', () => {
      it('should update a dictionary entry', async () => {
        const updateData = { de: 'hallo' };
        const mockResult = {
          dictionary_id: 'd1',
          translations: { en: 'hello', es: 'hola', de: 'hallo' },
        };
        mockPut(
          `/entities/${entitySlug}/projects/${projectId}/dictionary/${dictionaryId}`,
          mockResult
        );

        const result = await client.updateDictionary(
          entitySlug,
          projectId,
          dictionaryId,
          updateData
        );

        expect(result).toEqual(mockResult);
      });
    });

    describe('deleteDictionary', () => {
      it('should delete a dictionary entry', async () => {
        const mockResult = {
          dictionary_id: 'd1',
          translations: { en: 'hello', es: 'hola' },
        };
        mockNetwork.setMockResponse(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects/${projectId}/dictionary/${dictionaryId}`,
          { data: { data: mockResult }, ok: true },
          'DELETE'
        );

        const result = await client.deleteDictionary(
          entitySlug,
          projectId,
          dictionaryId
        );

        expect(result).toEqual(mockResult);
      });
    });
  });

  describe('Settings', () => {
    describe('getSettings', () => {
      it('should fetch user settings', async () => {
        const mockSettings = { organization_name: 'Test Org' };
        mockGet(`/users/${userId}/settings`, mockSettings);

        const result = await client.getSettings(userId);

        expect(result).toEqual(mockSettings);
      });
    });

    describe('updateSettings', () => {
      it('should update user settings', async () => {
        const updateData = { organization_name: 'New Org Name' };
        mockPut(`/users/${userId}/settings`, updateData);

        const result = await client.updateSettings(userId, updateData);

        expect(result).toEqual(updateData);
      });
    });
  });

  describe('Analytics', () => {
    describe('getAnalytics', () => {
      it('should fetch analytics without filters', async () => {
        const mockAnalytics = { aggregate: { total_requests: 100 } };
        mockGet(`/entities/${entitySlug}/analytics`, mockAnalytics);

        const result = await client.getAnalytics(entitySlug);

        expect(result).toEqual(mockAnalytics);
      });

      it('should fetch analytics with date filters', async () => {
        const mockAnalytics = { aggregate: { total_requests: 50 } };
        // Use URL-based mock for the filtered request
        mockNetwork.setMockResponse(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/analytics?start_date=2024-01-01&end_date=2024-01-31`,
          { data: { data: mockAnalytics }, ok: true },
          'GET'
        );

        const result = await client.getAnalytics(
          entitySlug,
          '2024-01-01',
          '2024-01-31'
        );

        expect(result).toEqual(mockAnalytics);
      });
    });
  });

  describe('Rate Limits', () => {
    describe('getRateLimits', () => {
      it('should fetch rate limits for entity', async () => {
        const mockLimits = { hourly: { remaining: 100 } };
        mockGet(`/ratelimits/${entitySlug}`, mockLimits);

        const result = await client.getRateLimits(entitySlug);

        expect(result).toEqual(mockLimits);
      });

      it('should include testMode parameter when specified', async () => {
        mockNetwork.setMockResponse(
          `${baseUrl}${apiPrefix}/ratelimits/${entitySlug}?testMode=true`,
          { data: { data: {} }, ok: true },
          'GET'
        );

        await client.getRateLimits(entitySlug, true);

        expect(
          mockNetwork.wasUrlCalled(
            `${baseUrl}${apiPrefix}/ratelimits/${entitySlug}?testMode=true`,
            'GET'
          )
        ).toBe(true);
      });
    });
  });

  describe('Translation', () => {
    describe('translate', () => {
      it('should send translation request', async () => {
        const request = {
          strings: ['Hello', 'World'],
          target_languages: ['es'],
        };
        const mockResponse = {
          translations: { es: ['Hola', 'Mundo'] },
        };
        mockPost('/translate/my-org/my-project', mockResponse);

        const result = await client.translate('my-org', 'my-project', request);

        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Error handling', () => {
    it('should throw WhisperlyApiError on failed request', async () => {
      mockNetwork.setMockResponse(
        `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects`,
        { ok: false, status: 401, statusText: 'Unauthorized', data: { error: 'Not authenticated' } },
        'GET'
      );

      await expect(client.getProjects(entitySlug)).rejects.toThrow(
        'API request failed: Unauthorized'
      );
    });
  });
});
