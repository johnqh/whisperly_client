/**
 * @sudobility/whisperly_client
 * React client library for Whisperly API with TanStack Query hooks
 */

// Network client
export * from './network';

// Hooks
export * from './hooks';

// Utilities
export * from './utils';

// Local types
export type { WhisperlyClientConfig, QueryKeys } from './types';
export { QUERY_KEYS } from './types';

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
