import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WhisperlyClient } from './WhisperlyClient';
import type { WhisperlyClientConfig } from '../types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('WhisperlyClient', () => {
  let client: WhisperlyClient;
  const mockGetIdToken = vi.fn();
  const baseUrl = 'https://api.example.com';
  const apiPrefix = '/api/v1';
  const entitySlug = 'my-org';
  const userId = 'user-123';
  const projectId = 'proj-1';

  const config: WhisperlyClientConfig = {
    baseUrl,
    getIdToken: mockGetIdToken,
  };

  beforeEach(() => {
    client = new WhisperlyClient(config);
    mockGetIdToken.mockResolvedValue('mock-token');
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with config', () => {
      expect(client).toBeInstanceOf(WhisperlyClient);
    });
  });

  describe('Projects', () => {
    describe('getProjects', () => {
      it('should fetch projects with auth headers', async () => {
        const mockProjects = [{ id: '1', name: 'Project 1' }];
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockProjects),
        });

        const result = await client.getProjects(entitySlug);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects`,
          expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
              Authorization: 'Bearer mock-token',
            }),
          })
        );
        expect(result).toEqual(mockProjects);
      });
    });

    describe('getProject', () => {
      it('should fetch a single project by id', async () => {
        const mockProject = { id: 'proj-1', name: 'Test Project' };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockProject),
        });

        const result = await client.getProject(entitySlug, projectId);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects/${projectId}`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(mockProject);
      });
    });

    describe('createProject', () => {
      it('should create a project with POST request', async () => {
        const createData = { project_name: 'new-project', display_name: 'New Project' };
        const mockProject = { id: 'new-1', ...createData };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockProject),
        });

        const result = await client.createProject(entitySlug, createData);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects`,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(createData),
          })
        );
        expect(result).toEqual(mockProject);
      });
    });

    describe('updateProject', () => {
      it('should update a project with PUT request', async () => {
        const updateData = { display_name: 'Updated Project' };
        const mockProject = { id: 'proj-1', display_name: 'Updated Project' };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockProject),
        });

        const result = await client.updateProject(entitySlug, projectId, updateData);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects/${projectId}`,
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(updateData),
          })
        );
        expect(result).toEqual(mockProject);
      });
    });

    describe('deleteProject', () => {
      it('should delete a project with DELETE request', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        await client.deleteProject(entitySlug, projectId);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects/${projectId}`,
          expect.objectContaining({ method: 'DELETE' })
        );
      });

      it('should throw error when delete fails', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          statusText: 'Not Found',
        });

        await expect(client.deleteProject(entitySlug, projectId)).rejects.toThrow(
          'Failed to delete project: Not Found'
        );
      });
    });
  });

  describe('Dictionary', () => {
    const dictionaryId = 'd1';

    describe('searchDictionary', () => {
      it('should search dictionary by language code and text', async () => {
        const mockResult = { dictionary_id: 'd1', translations: { en: 'hello', es: 'hola' } };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResult),
        });

        const result = await client.searchDictionary(entitySlug, projectId, 'en', 'hello');

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects/${projectId}/dictionary/search/en/hello`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(mockResult);
      });
    });

    describe('createDictionary', () => {
      it('should create a dictionary entry', async () => {
        const createData = { en: 'hello', es: 'hola' };
        const mockResult = { dictionary_id: 'd1', translations: createData };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResult),
        });

        const result = await client.createDictionary(entitySlug, projectId, createData);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects/${projectId}/dictionary`,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(createData),
          })
        );
        expect(result).toEqual(mockResult);
      });
    });

    describe('updateDictionary', () => {
      it('should update a dictionary entry', async () => {
        const updateData = { de: 'hallo' };
        const mockResult = { dictionary_id: 'd1', translations: { en: 'hello', es: 'hola', de: 'hallo' } };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResult),
        });

        const result = await client.updateDictionary(entitySlug, projectId, dictionaryId, updateData);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects/${projectId}/dictionary/${dictionaryId}`,
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(updateData),
          })
        );
        expect(result).toEqual(mockResult);
      });
    });

    describe('deleteDictionary', () => {
      it('should delete a dictionary entry', async () => {
        const mockResult = { dictionary_id: 'd1', translations: { en: 'hello', es: 'hola' } };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResult),
        });

        const result = await client.deleteDictionary(entitySlug, projectId, dictionaryId);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/projects/${projectId}/dictionary/${dictionaryId}`,
          expect.objectContaining({ method: 'DELETE' })
        );
        expect(result).toEqual(mockResult);
      });
    });
  });

  describe('Settings', () => {
    describe('getSettings', () => {
      it('should fetch user settings', async () => {
        const mockSettings = { organization_name: 'Test Org' };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSettings),
        });

        const result = await client.getSettings(userId);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/users/${userId}/settings`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(mockSettings);
      });
    });

    describe('updateSettings', () => {
      it('should update user settings', async () => {
        const updateData = { organization_name: 'New Org Name' };
        const mockSettings = { ...updateData };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSettings),
        });

        const result = await client.updateSettings(userId, updateData);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/users/${userId}/settings`,
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(updateData),
          })
        );
        expect(result).toEqual(mockSettings);
      });
    });
  });

  describe('Analytics', () => {
    describe('getAnalytics', () => {
      it('should fetch analytics without filters', async () => {
        const mockAnalytics = { aggregate: { total_requests: 100 } };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockAnalytics),
        });

        const result = await client.getAnalytics(entitySlug);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/entities/${entitySlug}/analytics`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(mockAnalytics);
      });

      it('should fetch analytics with date filters', async () => {
        const mockAnalytics = { aggregate: { total_requests: 50 } };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockAnalytics),
        });

        await client.getAnalytics(entitySlug, '2024-01-01', '2024-01-31');

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('start_date=2024-01-01'),
          expect.any(Object)
        );
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('end_date=2024-01-31'),
          expect.any(Object)
        );
      });

      it('should fetch analytics with project filter', async () => {
        const mockAnalytics = { aggregate: { total_requests: 25 } };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockAnalytics),
        });

        await client.getAnalytics(entitySlug, undefined, undefined, projectId);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('project_id=proj-1'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Rate Limits', () => {
    describe('getRateLimits', () => {
      it('should fetch rate limits for entity', async () => {
        const mockLimits = { hourly: { remaining: 100 } };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockLimits),
        });

        const result = await client.getRateLimits(entitySlug);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/ratelimits/${entitySlug}`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(mockLimits);
      });

      it('should include testMode parameter when specified', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

        await client.getRateLimits(entitySlug, true);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/ratelimits/${entitySlug}?testMode=true`,
          expect.any(Object)
        );
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
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        });

        const result = await client.translate('my-org', 'my-project', request);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}${apiPrefix}/translate/my-org/my-project`,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(request),
          })
        );
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Error handling', () => {
    it('should throw when token is not available', async () => {
      mockGetIdToken.mockResolvedValueOnce(undefined);

      await expect(client.getProjects(entitySlug)).rejects.toThrow();
    });
  });
});
