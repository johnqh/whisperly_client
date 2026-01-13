import type { User } from 'firebase/auth';

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

// =============================================================================
// Endpoint Types
// =============================================================================

export type HttpMethod = 'GET' | 'POST';

export interface Endpoint {
  id: string;
  project_id: string;
  endpoint_name: string;
  display_name: string;
  http_method: HttpMethod;
  instructions: string | null;
  default_source_language: string | null;
  default_target_languages: string[] | null;
  is_active: boolean;
  ip_allowlist: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface EndpointCreateRequest {
  endpoint_name: string;
  display_name: string;
  http_method?: HttpMethod;
  instructions?: string;
  default_source_language?: string;
  default_target_languages?: string[];
  ip_allowlist?: string[];
}

export interface EndpointUpdateRequest {
  endpoint_name?: string;
  display_name?: string;
  http_method?: HttpMethod;
  instructions?: string;
  default_source_language?: string | null;
  default_target_languages?: string[] | null;
  is_active?: boolean;
  ip_allowlist?: string[] | null;
}
