import type {
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
} from '@sudobility/whisperly_types';
import type { WhisperlyClientConfig, Endpoint, EndpointCreateRequest, EndpointUpdateRequest } from '../types';
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
  // Endpoints (Entity-centric: /entities/:entitySlug/projects/:projectId/endpoints)
  // =============================================================================
  async getEndpoints(entitySlug: string, projectId: string): Promise<Endpoint[]> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/entities/${entitySlug}/projects/${projectId}/endpoints`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<Endpoint[]>(response);
  }

  async getEndpoint(
    entitySlug: string,
    projectId: string,
    endpointId: string
  ): Promise<Endpoint> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/entities/${entitySlug}/projects/${projectId}/endpoints/${endpointId}`
      ),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<Endpoint>(response);
  }

  async createEndpoint(
    entitySlug: string,
    projectId: string,
    data: EndpointCreateRequest
  ): Promise<Endpoint> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/entities/${entitySlug}/projects/${projectId}/endpoints`),
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<Endpoint>(response);
  }

  async updateEndpoint(
    entitySlug: string,
    projectId: string,
    endpointId: string,
    data: EndpointUpdateRequest
  ): Promise<Endpoint> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/entities/${entitySlug}/projects/${projectId}/endpoints/${endpointId}`
      ),
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<Endpoint>(response);
  }

  async deleteEndpoint(
    entitySlug: string,
    projectId: string,
    endpointId: string
  ): Promise<void> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/entities/${entitySlug}/projects/${projectId}/endpoints/${endpointId}`
      ),
      {
        method: 'DELETE',
        headers,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete endpoint: ${response.statusText}`);
    }
  }

  // =============================================================================
  // Glossaries (Entity-centric: /entities/:entitySlug/projects/:projectId/glossaries)
  // =============================================================================
  async getGlossaries(entitySlug: string, projectId: string): Promise<Glossary[]> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/entities/${entitySlug}/projects/${projectId}/glossaries`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<Glossary[]>(response);
  }

  async getGlossary(
    entitySlug: string,
    projectId: string,
    glossaryId: string
  ): Promise<Glossary> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/entities/${entitySlug}/projects/${projectId}/glossaries/${glossaryId}`
      ),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<Glossary>(response);
  }

  async createGlossary(
    entitySlug: string,
    projectId: string,
    data: GlossaryCreateRequest
  ): Promise<Glossary> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/entities/${entitySlug}/projects/${projectId}/glossaries`),
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<Glossary>(response);
  }

  async updateGlossary(
    entitySlug: string,
    projectId: string,
    glossaryId: string,
    data: GlossaryUpdateRequest
  ): Promise<Glossary> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/entities/${entitySlug}/projects/${projectId}/glossaries/${glossaryId}`
      ),
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<Glossary>(response);
  }

  async deleteGlossary(
    entitySlug: string,
    projectId: string,
    glossaryId: string
  ): Promise<void> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/entities/${entitySlug}/projects/${projectId}/glossaries/${glossaryId}`
      ),
      {
        method: 'DELETE',
        headers,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete glossary: ${response.statusText}`);
    }
  }

  async importGlossaries(
    entitySlug: string,
    projectId: string,
    glossaries: GlossaryCreateRequest[]
  ): Promise<Glossary[]> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/entities/${entitySlug}/projects/${projectId}/glossaries/import`
      ),
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ glossaries }),
      }
    );
    return handleApiResponse<Glossary[]>(response);
  }

  async exportGlossaries(
    entitySlug: string,
    projectId: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<string> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/entities/${entitySlug}/projects/${projectId}/glossaries/export${formatQueryParams({ format })}`
      ),
      {
        method: 'GET',
        headers,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to export glossaries: ${response.statusText}`);
    }
    return response.text();
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
  // Translation (Public: /translate/:orgPath/:projectName/:endpointName)
  // Note: This endpoint is typically called without auth for consumer use
  // =============================================================================
  async translate(
    orgPath: string,
    projectName: string,
    endpointName: string,
    request: TranslationRequest
  ): Promise<TranslationResponse> {
    // Translation endpoint is public, no auth needed
    const response = await fetch(
      buildUrl(this.baseUrl, `/translate/${orgPath}/${projectName}/${endpointName}`),
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
