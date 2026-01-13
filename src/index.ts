// Types
export type {
  FirebaseIdToken,
  WhisperlyClientConfig,
  AuthHeaders,
  QueryKeys,
  UseFirebaseAuth,
  HttpMethod,
  Endpoint,
  EndpointCreateRequest,
  EndpointUpdateRequest,
} from './types';
export { QUERY_KEYS } from './types';

// Utils
export {
  createAuthHeaders,
  buildUrl,
  handleApiResponse,
  formatQueryParams,
  WhisperlyApiError,
} from './utils/whisperly-helpers';

// Client
export { WhisperlyClient } from './network/WhisperlyClient';

// Hooks
export {
  useProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from './hooks/useProjects';

export {
  useEndpoints,
  useEndpoint,
  useCreateEndpoint,
  useUpdateEndpoint,
  useDeleteEndpoint,
} from './hooks/useEndpoints';

export {
  useGlossaries,
  useGlossary,
  useCreateGlossary,
  useUpdateGlossary,
  useDeleteGlossary,
  useImportGlossaries,
  useExportGlossaries,
} from './hooks/useGlossaries';

export { useSettings, useUpdateSettings } from './hooks/useSettings';

export { useAnalytics } from './hooks/useAnalytics';
export type { UseAnalyticsOptions } from './hooks/useAnalytics';

export { useTranslate } from './hooks/useTranslate';

// Re-export types from whisperly_types for convenience
export type {
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  Glossary,
  GlossaryCreateRequest,
  GlossaryUpdateRequest,
  UserSettings,
  UserSettingsUpdateRequest,
  AnalyticsResponse,
  TranslationRequest,
  TranslationResponse,
  GlossaryLookupResponse,
  ApiResponse,
  PaginatedResponse,
} from '@sudobility/whisperly_types';
