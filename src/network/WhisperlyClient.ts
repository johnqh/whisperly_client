import type {
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  DictionaryCreateRequest,
  DictionaryUpdateRequest,
  DictionarySearchResponse,
  ProjectLanguagesResponse,
  AvailableLanguage,
  UserSettings,
  UserSettingsUpdateRequest,
  AnalyticsResponse,
  TranslationRequest,
  TranslationResponse,
  RateLimitStatus,
} from '@sudobility/whisperly_types';
import type { NetworkClient } from '@sudobility/types';
import type { WhisperlyClientConfig } from '../types';
import {
  buildUrl,
  handleNetworkResponse,
  formatQueryParams,
  WhisperlyApiError,
} from '../utils/whisperly-helpers';

/**
 * Typed API client for the Whisperly localization platform.
 *
 * Wraps all Whisperly REST API endpoints with type-safe methods.
 * Each method uses the configured {@link NetworkClient} for HTTP requests
 * and returns parsed, typed response data.
 *
 * @example
 * ```ts
 * const client = new WhisperlyClient({
 *   baseUrl: 'https://api.whisperly.io',
 *   networkClient: myNetworkClient,
 * });
 *
 * const projects = await client.getProjects('my-org');
 * ```
 */
export class WhisperlyClient {
  private readonly baseUrl: string;
  private readonly networkClient: NetworkClient;
  private apiPrefix = '/api/v1';

  /**
   * Creates a new WhisperlyClient instance.
   *
   * @param config - Client configuration containing the base URL and network client
   */
  constructor(config: WhisperlyClientConfig) {
    this.baseUrl = config.baseUrl;
    this.networkClient = config.networkClient;
  }

  /**
   * Builds a full API URL from a path and optional query parameters.
   *
   * @param path - The API path (e.g., `/entities/my-org/projects`)
   * @param params - Optional query parameters to append to the URL
   * @returns The full URL string with API prefix and query parameters
   */
  private url(
    path: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const queryString = params ? formatQueryParams(params) : '';
    return buildUrl(this.baseUrl, `${this.apiPrefix}${path}${queryString}`);
  }

  // =============================================================================
  // Projects (Entity-centric: /entities/:entitySlug/projects)
  // =============================================================================

  /**
   * Fetches all projects for an entity/organization.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @returns Array of projects belonging to the entity
   * @throws {@link WhisperlyApiError} If the API request fails
   */
  async getProjects(entitySlug: string): Promise<Project[]> {
    const response = await this.networkClient.get(
      this.url(`/entities/${entitySlug}/projects`)
    );
    return handleNetworkResponse<Project[]>(response);
  }

  /**
   * Fetches a single project by ID.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The unique project identifier
   * @returns The requested project
   * @throws {@link WhisperlyApiError} If the project is not found or the request fails
   */
  async getProject(entitySlug: string, projectId: string): Promise<Project> {
    const response = await this.networkClient.get(
      this.url(`/entities/${entitySlug}/projects/${projectId}`)
    );
    return handleNetworkResponse<Project>(response);
  }

  /**
   * Creates a new project within an entity.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param data - The project creation data including name and display name
   * @returns The newly created project
   * @throws {@link WhisperlyApiError} If validation fails or the request fails
   */
  async createProject(
    entitySlug: string,
    data: ProjectCreateRequest
  ): Promise<Project> {
    const response = await this.networkClient.post(
      this.url(`/entities/${entitySlug}/projects`),
      data
    );
    return handleNetworkResponse<Project>(response);
  }

  /**
   * Updates an existing project.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The unique project identifier
   * @param data - The fields to update (partial update supported)
   * @returns The updated project
   * @throws {@link WhisperlyApiError} If the project is not found or validation fails
   */
  async updateProject(
    entitySlug: string,
    projectId: string,
    data: ProjectUpdateRequest
  ): Promise<Project> {
    const response = await this.networkClient.put(
      this.url(`/entities/${entitySlug}/projects/${projectId}`),
      data
    );
    return handleNetworkResponse<Project>(response);
  }

  /**
   * Deletes a project by ID.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The unique project identifier to delete
   * @throws {@link WhisperlyApiError} If the project is not found or the request fails
   */
  async deleteProject(entitySlug: string, projectId: string): Promise<void> {
    const response = await this.networkClient.delete(
      this.url(`/entities/${entitySlug}/projects/${projectId}`)
    );
    if (!response.ok) {
      throw new WhisperlyApiError(
        `Failed to delete project: ${response.statusText}`,
        response.status,
        response.data
      );
    }
  }

  /**
   * Generates a new API key for a project. Replaces any existing API key.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The project to generate an API key for
   * @returns The updated project with the new API key
   * @throws {@link WhisperlyApiError} If the project is not found or the request fails
   */
  async generateProjectApiKey(
    entitySlug: string,
    projectId: string
  ): Promise<Project> {
    const response = await this.networkClient.post(
      this.url(`/entities/${entitySlug}/projects/${projectId}/api-key`)
    );
    return handleNetworkResponse<Project>(response);
  }

  /**
   * Deletes the API key for a project, revoking API access.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The project whose API key should be deleted
   * @returns The updated project with the API key removed
   * @throws {@link WhisperlyApiError} If the project is not found or the request fails
   */
  async deleteProjectApiKey(
    entitySlug: string,
    projectId: string
  ): Promise<Project> {
    const response = await this.networkClient.delete(
      this.url(`/entities/${entitySlug}/projects/${projectId}/api-key`)
    );
    return handleNetworkResponse<Project>(response);
  }

  // =============================================================================
  // Dictionary (Entity-centric: /entities/:entitySlug/projects/:projectId/dictionary)
  // =============================================================================

  /**
   * Fetches all dictionary entries for a project.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The project whose dictionary entries to fetch
   * @returns Array of dictionary search responses containing translations
   * @throws {@link WhisperlyApiError} If the request fails
   */
  async getDictionaries(
    entitySlug: string,
    projectId: string
  ): Promise<DictionarySearchResponse[]> {
    const response = await this.networkClient.get(
      this.url(
        `/entities/${entitySlug}/projects/${projectId}/dictionary`
      )
    );
    return handleNetworkResponse<DictionarySearchResponse[]>(response);
  }

  /**
   * Searches the project dictionary for a specific term in a given language.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The project whose dictionary to search
   * @param languageCode - The language code to search in (e.g., "en", "es")
   * @param text - The text to search for in the dictionary
   * @returns The matching dictionary entry with all translations
   * @throws {@link WhisperlyApiError} If no match is found or the request fails
   */
  async searchDictionary(
    entitySlug: string,
    projectId: string,
    languageCode: string,
    text: string
  ): Promise<DictionarySearchResponse> {
    const response = await this.networkClient.get(
      this.url(
        `/entities/${entitySlug}/projects/${projectId}/dictionary/search/${encodeURIComponent(languageCode)}/${encodeURIComponent(text)}`
      )
    );
    return handleNetworkResponse<DictionarySearchResponse>(response);
  }

  /**
   * Creates a new dictionary entry with translations.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The project to add the dictionary entry to
   * @param data - Translation mappings (e.g., `{ "en": "hello", "es": "hola" }`)
   * @returns The created dictionary entry
   * @throws {@link WhisperlyApiError} If validation fails or the request fails
   */
  async createDictionary(
    entitySlug: string,
    projectId: string,
    data: DictionaryCreateRequest
  ): Promise<DictionarySearchResponse> {
    const response = await this.networkClient.post(
      this.url(
        `/entities/${entitySlug}/projects/${projectId}/dictionary`
      ),
      data
    );
    return handleNetworkResponse<DictionarySearchResponse>(response);
  }

  /**
   * Updates an existing dictionary entry's translations.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The project containing the dictionary entry
   * @param dictionaryId - The dictionary entry to update
   * @param data - Updated translation mappings (partial update supported)
   * @returns The updated dictionary entry
   * @throws {@link WhisperlyApiError} If the entry is not found or validation fails
   */
  async updateDictionary(
    entitySlug: string,
    projectId: string,
    dictionaryId: string,
    data: DictionaryUpdateRequest
  ): Promise<DictionarySearchResponse> {
    const response = await this.networkClient.put(
      this.url(
        `/entities/${entitySlug}/projects/${projectId}/dictionary/${dictionaryId}`
      ),
      data
    );
    return handleNetworkResponse<DictionarySearchResponse>(response);
  }

  /**
   * Deletes a dictionary entry by ID.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The project containing the dictionary entry
   * @param dictionaryId - The dictionary entry to delete
   * @returns The deleted dictionary entry
   * @throws {@link WhisperlyApiError} If the entry is not found or the request fails
   */
  async deleteDictionary(
    entitySlug: string,
    projectId: string,
    dictionaryId: string
  ): Promise<DictionarySearchResponse> {
    const response = await this.networkClient.delete(
      this.url(
        `/entities/${entitySlug}/projects/${projectId}/dictionary/${dictionaryId}`
      )
    );
    return handleNetworkResponse<DictionarySearchResponse>(response);
  }

  // =============================================================================
  // Project Languages (Entity-centric: /entities/:entitySlug/projects/:projectId/languages)
  // =============================================================================

  /**
   * Fetches the configured languages for a project.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The project whose languages to fetch
   * @returns The project's language configuration
   * @throws {@link WhisperlyApiError} If the request fails
   */
  async getProjectLanguages(
    entitySlug: string,
    projectId: string
  ): Promise<ProjectLanguagesResponse> {
    const response = await this.networkClient.get(
      this.url(
        `/entities/${entitySlug}/projects/${projectId}/languages`
      )
    );
    return handleNetworkResponse<ProjectLanguagesResponse>(response);
  }

  /**
   * Updates the configured languages for a project.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param projectId - The project whose languages to update
   * @param languages - Comma-separated language codes (e.g., "en,es,fr")
   * @returns The updated project language configuration
   * @throws {@link WhisperlyApiError} If the request fails
   */
  async updateProjectLanguages(
    entitySlug: string,
    projectId: string,
    languages: string
  ): Promise<ProjectLanguagesResponse> {
    const response = await this.networkClient.post(
      this.url(
        `/entities/${entitySlug}/projects/${projectId}/languages`
      ),
      { languages }
    );
    return handleNetworkResponse<ProjectLanguagesResponse>(response);
  }

  // =============================================================================
  // Available Languages (Config: /available-languages)
  // =============================================================================

  /**
   * Fetches the list of all languages supported by the Whisperly platform.
   * This is a public endpoint that does not require authentication.
   *
   * @returns Array of available languages with codes, names, and flag emojis
   * @throws {@link WhisperlyApiError} If the request fails
   */
  async getAvailableLanguages(): Promise<AvailableLanguage[]> {
    const response = await this.networkClient.get(
      this.url('/available-languages')
    );
    return handleNetworkResponse<AvailableLanguage[]>(response);
  }

  // =============================================================================
  // Settings (User-specific: /users/:userId/settings)
  // =============================================================================

  /**
   * Fetches settings for a specific user.
   *
   * @param userId - The user's unique identifier (Firebase UID)
   * @returns The user's settings
   * @throws {@link WhisperlyApiError} If the user is not found or the request fails
   */
  async getSettings(userId: string): Promise<UserSettings> {
    const response = await this.networkClient.get(
      this.url(`/users/${userId}/settings`)
    );
    return handleNetworkResponse<UserSettings>(response);
  }

  /**
   * Updates settings for a specific user.
   *
   * @param userId - The user's unique identifier (Firebase UID)
   * @param data - The settings fields to update (partial update supported)
   * @returns The updated user settings
   * @throws {@link WhisperlyApiError} If the user is not found or validation fails
   */
  async updateSettings(
    userId: string,
    data: UserSettingsUpdateRequest
  ): Promise<UserSettings> {
    const response = await this.networkClient.put(
      this.url(`/users/${userId}/settings`),
      data
    );
    return handleNetworkResponse<UserSettings>(response);
  }

  // =============================================================================
  // Analytics (Entity-centric: /entities/:entitySlug/analytics)
  // =============================================================================

  /**
   * Fetches analytics data for an entity, optionally filtered by date range and project.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param startDate - Optional start date filter (ISO 8601 format, e.g., "2024-01-01")
   * @param endDate - Optional end date filter (ISO 8601 format, e.g., "2024-01-31")
   * @param projectId - Optional project ID to filter analytics for a specific project
   * @returns Analytics data including aggregates, per-project, and per-date breakdowns
   * @throws {@link WhisperlyApiError} If the request fails
   */
  async getAnalytics(
    entitySlug: string,
    startDate?: string,
    endDate?: string,
    projectId?: string
  ): Promise<AnalyticsResponse> {
    const response = await this.networkClient.get(
      this.url(`/entities/${entitySlug}/analytics`, {
        start_date: startDate,
        end_date: endDate,
        project_id: projectId,
      })
    );
    return handleNetworkResponse<AnalyticsResponse>(response);
  }

  // =============================================================================
  // Rate Limits (Entity-centric: /ratelimits/:entitySlug)
  // =============================================================================

  /**
   * Fetches the current rate limit status for an entity, including
   * monthly and hourly usage, limits, and reset timestamps.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param testMode - When true, returns test mode rate limits (defaults to false)
   * @returns The entity's current rate limit status
   * @throws {@link WhisperlyApiError} If the request fails
   */
  async getRateLimits(
    entitySlug: string,
    testMode: boolean = false
  ): Promise<RateLimitStatus> {
    const response = await this.networkClient.get(
      this.url(`/ratelimits/${entitySlug}`, {
        testMode: testMode ? 'true' : undefined,
      })
    );
    return handleNetworkResponse<RateLimitStatus>(response);
  }

  /**
   * Fetches historical rate limit usage data for an entity over a specified period.
   *
   * @param entitySlug - The entity/organization slug identifier
   * @param periodType - The time granularity for history data: `'hour'`, `'day'`, or `'month'`
   * @param testMode - When true, returns test mode history (defaults to false)
   * @returns Array of historical rate limit usage records for the specified period
   * @throws {@link WhisperlyApiError} If the request fails
   */
  async getRateLimitHistory(
    entitySlug: string,
    periodType: 'hour' | 'day' | 'month',
    testMode: boolean = false
  ): Promise<RateLimitStatus[]> {
    const response = await this.networkClient.get(
      this.url(`/ratelimits/${entitySlug}/history/${periodType}`, {
        testMode: testMode ? 'true' : undefined,
      })
    );
    return handleNetworkResponse<RateLimitStatus[]>(response);
  }

  // =============================================================================
  // Translation (Public: /translate/:orgPath/:projectName)
  // =============================================================================

  /**
   * Sends a translation request for a specific project.
   * This is the primary public API endpoint, optionally authenticated via API key.
   *
   * @param orgPath - The organization path/slug that owns the project
   * @param projectName - The project name to use for translation context and dictionary lookups
   * @param request - The translation request containing strings and target languages
   * @param testMode - When true, uses test mode (does not count against rate limits, defaults to false)
   * @param apiKey - Optional project API key for authentication (alternative to bearer token)
   * @returns The translation response with translated strings keyed by language
   * @throws {@link WhisperlyApiError} If the request fails or rate limits are exceeded
   */
  async translate(
    orgPath: string,
    projectName: string,
    request: TranslationRequest,
    testMode: boolean = false,
    apiKey?: string
  ): Promise<TranslationResponse> {
    const response = await this.networkClient.post(
      this.url(`/translate/${orgPath}/${projectName}`, {
        testMode: testMode ? 'true' : undefined,
        api_key: apiKey,
      }),
      request
    );
    return handleNetworkResponse<TranslationResponse>(response);
  }
}
