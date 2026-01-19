import type { User } from 'firebase/auth';

// Re-export Endpoint types from whisperly_types for convenience
export type {
  HttpMethod,
  Endpoint,
  EndpointCreateRequest,
  EndpointUpdateRequest,
} from '@sudobility/whisperly_types';

export type FirebaseIdToken = () => Promise<string | undefined>;

export interface WhisperlyClientConfig {
  baseUrl: string;
  getIdToken: FirebaseIdToken;
}

export type AuthHeaders = Record<string, string>;

export const QUERY_KEYS = {
  projects: 'whisperly-projects',
  project: 'whisperly-project',
  endpoints: 'whisperly-endpoints',
  endpoint: 'whisperly-endpoint',
  glossaries: 'whisperly-glossaries',
  glossary: 'whisperly-glossary',
  settings: 'whisperly-settings',
  analytics: 'whisperly-analytics',
  subscription: 'whisperly-subscription',
  translate: 'whisperly-translate',
  rateLimits: 'whisperly-rate-limits',
} as const;

export type QueryKeys = typeof QUERY_KEYS;

export interface UseFirebaseAuth {
  user: User | null;
  loading: boolean;
  getIdToken: FirebaseIdToken;
}
