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

        const result = await client.getProjects();

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/projects`,
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

        const result = await client.getProject('proj-1');

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/projects/proj-1`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(mockProject);
      });
    });

    describe('createProject', () => {
      it('should create a project with POST request', async () => {
        const createData = { name: 'New Project', source_language: 'en' };
        const mockProject = { id: 'new-1', ...createData };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockProject),
        });

        const result = await client.createProject(createData);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/projects`,
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
        const updateData = { name: 'Updated Project' };
        const mockProject = { id: 'proj-1', name: 'Updated Project' };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockProject),
        });

        const result = await client.updateProject('proj-1', updateData);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/projects/proj-1`,
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

        await client.deleteProject('proj-1');

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/projects/proj-1`,
          expect.objectContaining({ method: 'DELETE' })
        );
      });

      it('should throw error when delete fails', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          statusText: 'Not Found',
        });

        await expect(client.deleteProject('proj-1')).rejects.toThrow(
          'Failed to delete project: Not Found'
        );
      });
    });
  });

  describe('Glossaries', () => {
    describe('getGlossaries', () => {
      it('should fetch glossaries for a project', async () => {
        const mockGlossaries = [{ id: 'g1', term: 'hello' }];
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockGlossaries),
        });

        const result = await client.getGlossaries('proj-1');

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/projects/proj-1/glossaries`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(mockGlossaries);
      });
    });

    describe('createGlossary', () => {
      it('should create a glossary entry', async () => {
        const createData = { term: 'hello', translation: 'hola' };
        const mockGlossary = { id: 'g1', ...createData };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockGlossary),
        });

        const result = await client.createGlossary('proj-1', createData);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/projects/proj-1/glossaries`,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(createData),
          })
        );
        expect(result).toEqual(mockGlossary);
      });
    });

    describe('deleteGlossary', () => {
      it('should delete a glossary entry', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        await client.deleteGlossary('proj-1', 'g1');

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/projects/proj-1/glossaries/g1`,
          expect.objectContaining({ method: 'DELETE' })
        );
      });

      it('should throw error when delete fails', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          statusText: 'Not Found',
        });

        await expect(client.deleteGlossary('proj-1', 'g1')).rejects.toThrow(
          'Failed to delete glossary: Not Found'
        );
      });
    });

    describe('importGlossaries', () => {
      it('should import multiple glossaries', async () => {
        const glossaries = [
          { term: 'hello', translation: 'hola' },
          { term: 'world', translation: 'mundo' },
        ];
        const mockResult = [
          { id: 'g1', ...glossaries[0] },
          { id: 'g2', ...glossaries[1] },
        ];
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResult),
        });

        const result = await client.importGlossaries('proj-1', glossaries);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/projects/proj-1/glossaries/import`,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ glossaries }),
          })
        );
        expect(result).toEqual(mockResult);
      });
    });

    describe('exportGlossaries', () => {
      it('should export glossaries as JSON by default', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('[{"term": "hello"}]'),
        });

        const result = await client.exportGlossaries('proj-1');

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/projects/proj-1/glossaries/export?format=json`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toBe('[{"term": "hello"}]');
      });

      it('should export glossaries as CSV when specified', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('term,translation\nhello,hola'),
        });

        const result = await client.exportGlossaries('proj-1', 'csv');

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/projects/proj-1/glossaries/export?format=csv`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toBe('term,translation\nhello,hola');
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

        const result = await client.getSettings();

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/settings`,
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

        const result = await client.updateSettings(updateData);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/settings`,
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

        const result = await client.getAnalytics();

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/analytics`,
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

        await client.getAnalytics('2024-01-01', '2024-01-31');

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

        await client.getAnalytics(undefined, undefined, 'proj-1');

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('project_id=proj-1'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Subscription', () => {
    describe('getSubscription', () => {
      it('should fetch subscription status', async () => {
        const mockSubscription = { tier: 'pro', active: true };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSubscription),
        });

        const result = await client.getSubscription();

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/subscription`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(mockSubscription);
      });
    });

    describe('syncSubscription', () => {
      it('should sync subscription with POST request', async () => {
        const mockSubscription = { tier: 'pro', active: true };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSubscription),
        });

        const result = await client.syncSubscription();

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/subscription/sync`,
          expect.objectContaining({ method: 'POST' })
        );
        expect(result).toEqual(mockSubscription);
      });
    });
  });

  describe('Translation', () => {
    describe('translate', () => {
      it('should send translation request', async () => {
        const request = {
          strings: ['Hello', 'World'],
          target_language: 'es',
        };
        const mockResponse = {
          translations: ['Hola', 'Mundo'],
        };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        });

        const result = await client.translate('proj-1', request);

        expect(mockFetch).toHaveBeenCalledWith(
          `${baseUrl}/translate/proj-1`,
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

      await expect(client.getProjects()).rejects.toThrow();
    });
  });
});
