import type { NetworkClient } from '@sudobility/types';

/**
 * Configuration for creating a {@link WhisperlyClient} instance.
 */
export interface WhisperlyClientConfig {
  /** The base URL of the Whisperly API (e.g., `"https://api.whisperly.io"`). */
  baseUrl: string;
  /** The network client used for making HTTP requests. */
  networkClient: NetworkClient;
}

/**
 * Query key constants used by TanStack Query hooks for cache management.
 * Each key uniquely identifies a query's cached data and is used for
 * invalidation and refetching.
 */
export const QUERY_KEYS = {
  /** Key for the projects list query. */
  projects: 'whisperly-projects',
  /** Key for a single project query. */
  project: 'whisperly-project',
  /** Key for the dictionary entries list query. */
  dictionary: 'whisperly-dictionary',
  /** Key for dictionary search queries. */
  dictionarySearch: 'whisperly-dictionary-search',
  /** Key for project languages query. */
  projectLanguages: 'whisperly-project-languages',
  /** Key for available languages query. */
  availableLanguages: 'whisperly-available-languages',
  /** Key for user settings query. */
  settings: 'whisperly-settings',
  /** Key for analytics data query. */
  analytics: 'whisperly-analytics',
  /** Key for subscription data query. */
  subscription: 'whisperly-subscription',
  /** Key for translation queries. */
  translate: 'whisperly-translate',
  /** Key for rate limits query. */
  rateLimits: 'whisperly-rate-limits',
} as const;

/** The type of the {@link QUERY_KEYS} constant, providing string literal types for each key. */
export type QueryKeys = typeof QUERY_KEYS;
