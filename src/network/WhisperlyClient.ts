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
} from '@sudobility/whisperly_types';
import type { NetworkClient } from '@sudobility/types';
import type { WhisperlyClientConfig } from '../types';
import {
  buildUrl,
  handleNetworkResponse,
  formatQueryParams,
} from '../utils/whisperly-helpers';

export class WhisperlyClient {
  private readonly baseUrl: string;
  private readonly networkClient: NetworkClient;
  private apiPrefix = '/api/v1';

  constructor(config: WhisperlyClientConfig) {
    this.baseUrl = config.baseUrl;
    this.networkClient = config.networkClient;
  }

  private url(path: string): string {
    return buildUrl(this.baseUrl, `${this.apiPrefix}${path}`);
  }

  // =============================================================================
  // Projects (Entity-centric: /entities/:entitySlug/projects)
  // =============================================================================
  async getProjects(entitySlug: string): Promise<Project[]> {
    const response = await this.networkClient.get(
      this.url(`/entities/${entitySlug}/projects`)
    );
    return handleNetworkResponse<Project[]>(response);
  }

  async getProject(entitySlug: string, projectId: string): Promise<Project> {
    const response = await this.networkClient.get(
      this.url(`/entities/${entitySlug}/projects/${projectId}`)
    );
    return handleNetworkResponse<Project>(response);
  }

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

  async deleteProject(entitySlug: string, projectId: string): Promise<void> {
    const response = await this.networkClient.delete(
      this.url(`/entities/${entitySlug}/projects/${projectId}`)
    );
    if (!response.ok) {
      throw new Error(
        `Failed to delete project: ${response.statusText}`
      );
    }
  }

  async generateProjectApiKey(
    entitySlug: string,
    projectId: string
  ): Promise<Project> {
    const response = await this.networkClient.post(
      this.url(`/entities/${entitySlug}/projects/${projectId}/api-key`)
    );
    return handleNetworkResponse<Project>(response);
  }

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
  async getAvailableLanguages(): Promise<AvailableLanguage[]> {
    const response = await this.networkClient.get(
      this.url('/available-languages')
    );
    return handleNetworkResponse<AvailableLanguage[]>(response);
  }

  // =============================================================================
  // Settings (User-specific: /users/:userId/settings)
  // =============================================================================
  async getSettings(userId: string): Promise<UserSettings> {
    const response = await this.networkClient.get(
      this.url(`/users/${userId}/settings`)
    );
    return handleNetworkResponse<UserSettings>(response);
  }

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
  async getAnalytics(
    entitySlug: string,
    startDate?: string,
    endDate?: string,
    projectId?: string
  ): Promise<AnalyticsResponse> {
    const params = formatQueryParams({
      start_date: startDate,
      end_date: endDate,
      project_id: projectId,
    });
    const response = await this.networkClient.get(
      this.url(`/entities/${entitySlug}/analytics${params}`)
    );
    return handleNetworkResponse<AnalyticsResponse>(response);
  }

  // =============================================================================
  // Rate Limits (Entity-centric: /ratelimits/:entitySlug)
  // =============================================================================
  async getRateLimits(
    entitySlug: string,
    testMode: boolean = false
  ): Promise<unknown> {
    const params = testMode
      ? formatQueryParams({ testMode: 'true' })
      : '';
    const response = await this.networkClient.get(
      this.url(`/ratelimits/${entitySlug}${params}`)
    );
    return handleNetworkResponse<unknown>(response);
  }

  async getRateLimitHistory(
    entitySlug: string,
    periodType: 'hour' | 'day' | 'month',
    testMode: boolean = false
  ): Promise<unknown> {
    const params = testMode
      ? formatQueryParams({ testMode: 'true' })
      : '';
    const response = await this.networkClient.get(
      this.url(
        `/ratelimits/${entitySlug}/history/${periodType}${params}`
      )
    );
    return handleNetworkResponse<unknown>(response);
  }

  // =============================================================================
  // Translation (Public: /translate/:orgPath/:projectName)
  // =============================================================================
  async translate(
    orgPath: string,
    projectName: string,
    request: TranslationRequest,
    testMode: boolean = false,
    apiKey?: string
  ): Promise<TranslationResponse> {
    const params = formatQueryParams({
      testMode: testMode ? 'true' : undefined,
      api_key: apiKey,
    });
    const response = await this.networkClient.post(
      this.url(`/translate/${orgPath}/${projectName}${params}`),
      request
    );
    return handleNetworkResponse<TranslationResponse>(response);
  }
}
