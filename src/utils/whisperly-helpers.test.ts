import { describe, it, expect, vi } from 'vitest';
import {
  createAuthHeaders,
  buildUrl,
  WhisperlyApiError,
  handleApiResponse,
  formatQueryParams,
} from './whisperly-helpers';

describe('whisperly-helpers', () => {
  describe('createAuthHeaders', () => {
    it('should create headers with valid token', async () => {
      const getIdToken = vi.fn().mockResolvedValue('test-token');
      const headers = await createAuthHeaders(getIdToken);

      expect(headers).toEqual({
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      });
      expect(getIdToken).toHaveBeenCalledOnce();
    });

    it('should throw error when no token available', async () => {
      const getIdToken = vi.fn().mockResolvedValue(undefined);

      await expect(createAuthHeaders(getIdToken)).rejects.toThrow(
        'No authentication token available'
      );
    });
  });

  describe('buildUrl', () => {
    it('should combine base URL and path correctly', () => {
      expect(buildUrl('https://api.example.com', '/users')).toBe(
        'https://api.example.com/users'
      );
    });

    it('should handle trailing slash in base URL', () => {
      expect(buildUrl('https://api.example.com/', '/users')).toBe(
        'https://api.example.com/users'
      );
    });

    it('should handle path without leading slash', () => {
      expect(buildUrl('https://api.example.com', 'users')).toBe(
        'https://api.example.com/users'
      );
    });

    it('should handle both edge cases together', () => {
      expect(buildUrl('https://api.example.com/', 'users')).toBe(
        'https://api.example.com/users'
      );
    });
  });

  describe('WhisperlyApiError', () => {
    it('should create error with message and status code', () => {
      const error = new WhisperlyApiError('Test error', 404);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('WhisperlyApiError');
      expect(error.details).toBeUndefined();
    });

    it('should create error with details', () => {
      const details = { field: 'email', reason: 'invalid' };
      const error = new WhisperlyApiError('Validation failed', 400, details);

      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual(details);
    });
  });

  describe('handleApiResponse', () => {
    it('should return JSON for successful response', async () => {
      const data = { id: 1, name: 'Test' };
      const response = new Response(JSON.stringify(data), {
        status: 200,
        statusText: 'OK',
      });

      const result = await handleApiResponse(response);
      expect(result).toEqual(data);
    });

    it('should throw WhisperlyApiError for failed response with JSON details', async () => {
      const errorDetails = { error: 'Not found' };
      const response = new Response(JSON.stringify(errorDetails), {
        status: 404,
        statusText: 'Not Found',
      });

      await expect(handleApiResponse(response)).rejects.toMatchObject({
        name: 'WhisperlyApiError',
        message: 'API request failed: Not Found',
        statusCode: 404,
        details: errorDetails,
      });
    });

    it('should throw WhisperlyApiError for failed response with text details', async () => {
      const response = new Response('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(handleApiResponse(response)).rejects.toMatchObject({
        name: 'WhisperlyApiError',
        message: 'API request failed: Internal Server Error',
        statusCode: 500,
        details: 'Internal Server Error',
      });
    });
  });

  describe('formatQueryParams', () => {
    it('should format params correctly', () => {
      const result = formatQueryParams({ page: 1, limit: 10, active: true });
      expect(result).toBe('?page=1&limit=10&active=true');
    });

    it('should filter out undefined values', () => {
      const result = formatQueryParams({
        page: 1,
        limit: undefined,
        active: true,
      });
      expect(result).toBe('?page=1&active=true');
    });

    it('should return empty string for empty params', () => {
      expect(formatQueryParams({})).toBe('');
    });

    it('should return empty string when all values are undefined', () => {
      expect(formatQueryParams({ a: undefined, b: undefined })).toBe('');
    });

    it('should handle string values', () => {
      const result = formatQueryParams({ search: 'test query', status: 'active' });
      expect(result).toBe('?search=test+query&status=active');
    });
  });
});
