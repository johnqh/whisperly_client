import type { NetworkResponse } from '@sudobility/types';

/**
 * Builds a normalized URL by combining a base URL and path.
 * Handles trailing slashes on the base and missing leading slashes on the path.
 *
 * @param baseUrl - The base URL (e.g., `"https://api.example.com"` or `"https://api.example.com/"`)
 * @param path - The path to append (e.g., `"/users"` or `"users"`)
 * @returns The combined URL string
 *
 * @example
 * ```ts
 * buildUrl('https://api.example.com/', '/users') // "https://api.example.com/users"
 * buildUrl('https://api.example.com', 'users')   // "https://api.example.com/users"
 * ```
 */
export function buildUrl(baseUrl: string, path: string): string {
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Custom error class for Whisperly API errors.
 * Thrown when the API returns a non-2xx response.
 *
 * @example
 * ```ts
 * try {
 *   await client.getProject('my-org', 'invalid-id');
 * } catch (error) {
 *   if (error instanceof WhisperlyApiError) {
 *     console.log(error.statusCode); // 404
 *     console.log(error.details);    // { error: 'Not found' }
 *   }
 * }
 * ```
 */
export class WhisperlyApiError extends Error {
  /**
   * Creates a new WhisperlyApiError.
   *
   * @param message - Human-readable error description
   * @param statusCode - The HTTP status code from the API response
   * @param details - Optional additional error details from the response body
   */
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'WhisperlyApiError';
  }
}

/**
 * Processes a {@link NetworkResponse} and extracts the typed data payload.
 *
 * The Whisperly API returns responses in the shape `{ success, data, timestamp }`.
 * This function extracts the `data` field from successful responses and throws
 * a {@link WhisperlyApiError} for failed responses.
 *
 * @template T - The expected type of the response data
 * @param response - The raw network response to process
 * @returns The extracted and typed response data
 * @throws {@link WhisperlyApiError} If the response indicates a failed request (`ok: false`)
 */
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

/**
 * Formats an object of key-value pairs into a URL query string.
 * Filters out entries with `undefined` values.
 *
 * @param params - Object of parameter names to values. Undefined values are excluded.
 * @returns A query string starting with `?` (e.g., `"?page=1&limit=10"`),
 *          or an empty string if no valid parameters exist.
 *
 * @example
 * ```ts
 * formatQueryParams({ page: 1, limit: 10 })       // "?page=1&limit=10"
 * formatQueryParams({ search: 'test', q: undefined }) // "?search=test"
 * formatQueryParams({})                             // ""
 * ```
 */
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
