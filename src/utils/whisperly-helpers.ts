import type { AuthHeaders, FirebaseIdToken } from '../types';

export async function createAuthHeaders(
  getIdToken: FirebaseIdToken
): Promise<AuthHeaders> {
  const token = await getIdToken();
  if (!token) {
    throw new Error('No authentication token available');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export function buildUrl(baseUrl: string, path: string): string {
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export class WhisperlyApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'WhisperlyApiError';
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let details: unknown;
    try {
      details = await response.json();
    } catch {
      details = await response.text();
    }
    throw new WhisperlyApiError(
      `API request failed: ${response.statusText}`,
      response.status,
      details
    );
  }
  return response.json() as Promise<T>;
}

export function formatQueryParams(
  params: Record<string, string | number | boolean | undefined>
): string {
  const filtered = Object.entries(params).filter(
    ([, value]) => value !== undefined
  );
  if (filtered.length === 0) return '';
  const searchParams = new URLSearchParams();
  filtered.forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return `?${searchParams.toString()}`;
}
