import type {
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  DictionaryCreateRequest,
  DictionaryUpdateRequest,
  DictionarySearchResponse,
  UserSettings,
  UserSettingsUpdateRequest,
  AnalyticsResponse,
  TranslationRequest,
  TranslationResponse,
} from '@sudobility/whisperly_types';
import type { WhisperlyClientConfig } from '../types';
import {
  createAuthHeaders,
  buildUrl,
  handleApiResponse,
  formatQueryParams,
} from '../utils/whisperly-helpers';

export class WhisperlyClient {
  private baseUrl: string;
  private getIdToken: () => Promise<string | undefined>;

  constructor(config: WhisperlyClientConfig) {
    this.baseUrl = config.baseUrl;
    this.getIdToken = config.getIdToken;
  }

  // =============================================================================
  // Projects (Entity-centric: /entities/:entitySlug/projects)
  // =============================================================================
  async getProjects(entitySlug: string): Promise<Project[]> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/entities/${entitySlug}/projects`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<Project[]>(response);
  }

  async getProject(entitySlug: string, projectId: string): Promise<Project> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/entities/${entitySlug}/projects/${projectId}`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<Project>(response);
  }

  async createProject(entitySlug: string, data: ProjectCreateRequest): Promise<Project> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/entities/${entitySlug}/projects`),
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<Project>(response);
  }

  async updateProject(
    entitySlug: string,
    projectId: string,
    data: ProjectUpdateRequest
  ): Promise<Project> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/entities/${entitySlug}/projects/${projectId}`),
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<Project>(response);
  }

  async deleteProject(entitySlug: string, projectId: string): Promise<void> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/entities/${entitySlug}/projects/${projectId}`),
      {
        method: 'DELETE',
        headers,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.statusText}`);
    }
  }

  // =============================================================================
  // Dictionary (Entity-centric: /entities/:entitySlug/projects/:projectId/dictionary)
  // =============================================================================
  async searchDictionary(
    entitySlug: string,
    projectId: string,
    languageCode: string,
    text: string
  ): Promise<DictionarySearchResponse> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/entities/${entitySlug}/projects/${projectId}/dictionary/search/${encodeURIComponent(languageCode)}/${encodeURIComponent(text)}`
      ),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<DictionarySearchResponse>(response);
  }

  async createDictionary(
    entitySlug: string,
    projectId: string,
    data: DictionaryCreateRequest
  ): Promise<DictionarySearchResponse> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/entities/${entitySlug}/projects/${projectId}/dictionary`),
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<DictionarySearchResponse>(response);
  }

  async updateDictionary(
    entitySlug: string,
    projectId: string,
    dictionaryId: string,
    data: DictionaryUpdateRequest
  ): Promise<DictionarySearchResponse> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/entities/${entitySlug}/projects/${projectId}/dictionary/${dictionaryId}`
      ),
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<DictionarySearchResponse>(response);
  }

  async deleteDictionary(
    entitySlug: string,
    projectId: string,
    dictionaryId: string
  ): Promise<DictionarySearchResponse> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/entities/${entitySlug}/projects/${projectId}/dictionary/${dictionaryId}`
      ),
      {
        method: 'DELETE',
        headers,
      }
    );
    return handleApiResponse<DictionarySearchResponse>(response);
  }

  // =============================================================================
  // Settings (User-specific: /users/:userId/settings)
  // =============================================================================
  async getSettings(userId: string): Promise<UserSettings> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/users/${userId}/settings`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<UserSettings>(response);
  }

  async updateSettings(userId: string, data: UserSettingsUpdateRequest): Promise<UserSettings> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/users/${userId}/settings`),
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<UserSettings>(response);
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
    const headers = await createAuthHeaders(this.getIdToken);
    const params = formatQueryParams({
      start_date: startDate,
      end_date: endDate,
      project_id: projectId,
    });
    const response = await fetch(
      buildUrl(this.baseUrl, `/entities/${entitySlug}/analytics${params}`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<AnalyticsResponse>(response);
  }

  // =============================================================================
  // Rate Limits (Entity-centric: /ratelimits/:entitySlug)
  // =============================================================================
  async getRateLimits(entitySlug: string, testMode: boolean = false): Promise<unknown> {
    const headers = await createAuthHeaders(this.getIdToken);
    const params = testMode ? formatQueryParams({ testMode: 'true' }) : '';
    const response = await fetch(
      buildUrl(this.baseUrl, `/ratelimits/${entitySlug}${params}`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<unknown>(response);
  }

  async getRateLimitHistory(
    entitySlug: string,
    periodType: 'hour' | 'day' | 'month',
    testMode: boolean = false
  ): Promise<unknown> {
    const headers = await createAuthHeaders(this.getIdToken);
    const params = testMode ? formatQueryParams({ testMode: 'true' }) : '';
    const response = await fetch(
      buildUrl(this.baseUrl, `/ratelimits/${entitySlug}/history/${periodType}${params}`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<unknown>(response);
  }

  // =============================================================================
  // Translation (Public: /translate/:orgPath/:projectName)
  // Note: This endpoint is typically called without auth for consumer use
  // =============================================================================
  async translate(
    orgPath: string,
    projectName: string,
    request: TranslationRequest
  ): Promise<TranslationResponse> {
    // Translation endpoint is public, no auth needed
    const response = await fetch(
      buildUrl(this.baseUrl, `/translate/${orgPath}/${projectName}`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );
    return handleApiResponse<TranslationResponse>(response);
  }
}
