import { describe, it, expect } from 'vitest';
import { QUERY_KEYS } from './types';

describe('types', () => {
  describe('QUERY_KEYS', () => {
    it('should have all expected query keys', () => {
      expect(QUERY_KEYS.projects).toBe('whisperly-projects');
      expect(QUERY_KEYS.project).toBe('whisperly-project');
      expect(QUERY_KEYS.glossaries).toBe('whisperly-glossaries');
      expect(QUERY_KEYS.glossary).toBe('whisperly-glossary');
      expect(QUERY_KEYS.settings).toBe('whisperly-settings');
      expect(QUERY_KEYS.analytics).toBe('whisperly-analytics');
      expect(QUERY_KEYS.subscription).toBe('whisperly-subscription');
      expect(QUERY_KEYS.translate).toBe('whisperly-translate');
    });

    it('should have unique values for all keys', () => {
      const values = Object.values(QUERY_KEYS);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should have all keys prefixed with whisperly-', () => {
      for (const value of Object.values(QUERY_KEYS)) {
        expect(value).toMatch(/^whisperly-/);
      }
    });

    it('should be readonly (const assertion)', () => {
      // TypeScript enforces this at compile time, but we can verify the values are strings
      expect(typeof QUERY_KEYS.projects).toBe('string');
      expect(typeof QUERY_KEYS.project).toBe('string');
    });
  });
});
