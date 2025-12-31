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
  Subscription,
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

  // Projects
  async getProjects(): Promise<Project[]> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(buildUrl(this.baseUrl, '/projects'), {
      method: 'GET',
      headers,
    });
    return handleApiResponse<Project[]>(response);
  }

  async getProject(projectId: string): Promise<Project> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/projects/${projectId}`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<Project>(response);
  }

  async createProject(data: ProjectCreateRequest): Promise<Project> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(buildUrl(this.baseUrl, '/projects'), {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return handleApiResponse<Project>(response);
  }

  async updateProject(projectId: string, data: ProjectUpdateRequest): Promise<Project> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/projects/${projectId}`),
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<Project>(response);
  }

  async deleteProject(projectId: string): Promise<void> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/projects/${projectId}`),
      {
        method: 'DELETE',
        headers,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.statusText}`);
    }
  }

  // Glossaries
  async getGlossaries(projectId: string): Promise<Glossary[]> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/projects/${projectId}/glossaries`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<Glossary[]>(response);
  }

  async getGlossary(projectId: string, glossaryId: string): Promise<Glossary> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/projects/${projectId}/glossaries/${glossaryId}`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<Glossary>(response);
  }

  async createGlossary(
    projectId: string,
    data: GlossaryCreateRequest
  ): Promise<Glossary> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/projects/${projectId}/glossaries`),
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<Glossary>(response);
  }

  async updateGlossary(
    projectId: string,
    glossaryId: string,
    data: GlossaryUpdateRequest
  ): Promise<Glossary> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/projects/${projectId}/glossaries/${glossaryId}`),
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<Glossary>(response);
  }

  async deleteGlossary(projectId: string, glossaryId: string): Promise<void> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/projects/${projectId}/glossaries/${glossaryId}`),
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
    projectId: string,
    glossaries: GlossaryCreateRequest[]
  ): Promise<Glossary[]> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/projects/${projectId}/glossaries/import`),
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ glossaries }),
      }
    );
    return handleApiResponse<Glossary[]>(response);
  }

  async exportGlossaries(
    projectId: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<string> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(
        this.baseUrl,
        `/projects/${projectId}/glossaries/export${formatQueryParams({ format })}`
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

  // Settings
  async getSettings(): Promise<UserSettings> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(buildUrl(this.baseUrl, '/settings'), {
      method: 'GET',
      headers,
    });
    return handleApiResponse<UserSettings>(response);
  }

  async updateSettings(data: UserSettingsUpdateRequest): Promise<UserSettings> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(buildUrl(this.baseUrl, '/settings'), {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return handleApiResponse<UserSettings>(response);
  }

  // Analytics
  async getAnalytics(
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
      buildUrl(this.baseUrl, `/analytics${params}`),
      {
        method: 'GET',
        headers,
      }
    );
    return handleApiResponse<AnalyticsResponse>(response);
  }

  // Subscription
  async getSubscription(): Promise<Subscription> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(buildUrl(this.baseUrl, '/subscription'), {
      method: 'GET',
      headers,
    });
    return handleApiResponse<Subscription>(response);
  }

  async syncSubscription(): Promise<Subscription> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(buildUrl(this.baseUrl, '/subscription/sync'), {
      method: 'POST',
      headers,
    });
    return handleApiResponse<Subscription>(response);
  }

  // Translation
  async translate(
    projectId: string,
    request: TranslationRequest
  ): Promise<TranslationResponse> {
    const headers = await createAuthHeaders(this.getIdToken);
    const response = await fetch(
      buildUrl(this.baseUrl, `/translate/${projectId}`),
      {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      }
    );
    return handleApiResponse<TranslationResponse>(response);
  }
}
