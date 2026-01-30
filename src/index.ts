// Types
export type {
  FirebaseIdToken,
  WhisperlyClientConfig,
  AuthHeaders,
  QueryKeys,
  UseFirebaseAuth,
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
  useDictionaries,
  useSearchDictionary,
  useCreateDictionary,
  useUpdateDictionary,
  useDeleteDictionary,
} from './hooks/useDictionary';

export { useSettings, useUpdateSettings } from './hooks/useSettings';

export { useAnalytics } from './hooks/useAnalytics';
export type { UseAnalyticsOptions } from './hooks/useAnalytics';

export { useTranslate } from './hooks/useTranslate';

// Re-export types from whisperly_types for convenience
export type {
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  Dictionary,
  DictionaryEntry,
  DictionaryTranslations,
  DictionaryCreateRequest,
  DictionaryUpdateRequest,
  DictionarySearchResponse,
  DictionaryLookupResponse,
  ProjectLanguagesResponse,
  AvailableLanguage,
  UserSettings,
  UserSettingsUpdateRequest,
  AnalyticsResponse,
  TranslationRequest,
  TranslationResponse,
  ApiResponse,
  PaginatedResponse,
} from '@sudobility/whisperly_types';
