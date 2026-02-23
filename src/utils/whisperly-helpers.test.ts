import { describe, it, expect } from 'vitest';
import {
  buildUrl,
  WhisperlyApiError,
  handleNetworkResponse,
  formatQueryParams,
} from './whisperly-helpers';
import type { NetworkResponse } from '@sudobility/types';

describe('whisperly-helpers', () => {
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

  describe('handleNetworkResponse', () => {
    it('should extract data field from successful response', () => {
      const response: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { data: { id: 1, name: 'Test' } },
      };

      const result = handleNetworkResponse<{ id: number; name: string }>(response);
      expect(result).toEqual({ id: 1, name: 'Test' });
    });

    it('should return raw data when no data field', () => {
      const response: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { id: 1, name: 'Test' },
      };

      const result = handleNetworkResponse<{ id: number; name: string }>(response);
      expect(result).toEqual({ id: 1, name: 'Test' });
    });

    it('should throw WhisperlyApiError for failed response', () => {
      const response: NetworkResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        success: false,
        data: { error: 'Not found' },
      };

      expect(() => handleNetworkResponse(response)).toThrow(WhisperlyApiError);
      expect(() => handleNetworkResponse(response)).toThrow(
        'API request failed: Not Found'
      );
    });

    it('should include details in error', () => {
      const errorData = { error: 'Validation failed' };
      const response: NetworkResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        success: false,
        data: errorData,
      };

      try {
        handleNetworkResponse(response);
        expect.fail('should have thrown');
      } catch (e) {
        const err = e as WhisperlyApiError;
        expect(err.statusCode).toBe(400);
        expect(err.details).toEqual(errorData);
      }
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
      const result = formatQueryParams({
        search: 'test query',
        status: 'active',
      });
      expect(result).toBe('?search=test+query&status=active');
    });
  });
});
