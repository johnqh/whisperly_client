import type { NetworkResponse } from '@sudobility/types';

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

export function handleNetworkResponse<T>(
  response: NetworkResponse
): T {
  if (!response.ok) {
    throw new WhisperlyApiError(
      `API request failed: ${response.statusText}`,
      response.status,
      response.data
    );
  }
  const json = response.data as Record<string, unknown> | null;
  // API returns { success, data, timestamp } - extract the data field
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }
  return json as T;
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
