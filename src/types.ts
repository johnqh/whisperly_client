import type { NetworkClient } from '@sudobility/types';

export interface WhisperlyClientConfig {
  baseUrl: string;
  networkClient: NetworkClient;
}

export const QUERY_KEYS = {
  projects: 'whisperly-projects',
  project: 'whisperly-project',
  dictionary: 'whisperly-dictionary',
  dictionarySearch: 'whisperly-dictionary-search',
  projectLanguages: 'whisperly-project-languages',
  availableLanguages: 'whisperly-available-languages',
  settings: 'whisperly-settings',
  analytics: 'whisperly-analytics',
  subscription: 'whisperly-subscription',
  translate: 'whisperly-translate',
  rateLimits: 'whisperly-rate-limits',
} as const;

export type QueryKeys = typeof QUERY_KEYS;
