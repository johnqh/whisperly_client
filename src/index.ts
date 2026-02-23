// Types
export type { WhisperlyClientConfig, QueryKeys } from './types';
export { QUERY_KEYS } from './types';

// Utils
export {
  buildUrl,
  handleNetworkResponse,
  formatQueryParams,
  WhisperlyApiError,
} from './utils/whisperly-helpers';

// Client
export { WhisperlyClient } from './network/WhisperlyClient';

// Hooks
export {
  useProjects,
  useProject,
  useGenerateApiKey,
  useDeleteApiKey,
} from './hooks/useProjects';

export { useDictionaries, useSearchDictionary } from './hooks/useDictionary';

export { useSettings } from './hooks/useSettings';

export {
  useProjectLanguages,
  useAvailableLanguages,
} from './hooks/useLanguages';

export { useAnalytics } from './hooks/useAnalytics';
export type { UseAnalyticsOptions } from './hooks/useAnalytics';

export { useTranslate } from './hooks/useTranslate';

// Re-export types from whisperly_types for convenience
export type {
  // Entity types
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
  RateLimitStatus,
  RateLimitTier,
  // Response wrappers
  ApiResponse,
  PaginatedResponse,
  // Usage/analytics types
  UsageAggregate,
  UsageByProject,
  UsageByDate,
  User,
  UserCreateRequest,
  UsageRecord,
} from '@sudobility/whisperly_types';
