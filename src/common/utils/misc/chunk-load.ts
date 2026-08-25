/**
 * Detect stale Vite/React.lazy chunk failures (typical right after a deploy).
 * Used only to show a clearer error message — recovery is always manual reload.
 */
const CHUNK_LOAD_ERROR_RE =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS|ChunkLoadError/i;

const readErrorText = (error: unknown, depth = 0): string => {
  if (!error || depth > 3) return '';
  if (typeof error === 'string') return error;
  if (error instanceof Error) {
    const cause = (error as Error & { cause?: unknown }).cause;
    return `${error.name} ${error.message} ${readErrorText(cause, depth + 1)}`;
  }
  if (typeof error === 'object' && error !== null) {
    const record = error as Record<string, unknown>;
    const parts = [record.message, record.name, record.error, record.cause]
      .filter((value) => value != null)
      .map((value) =>
        typeof value === 'string' ||
        value instanceof Error ||
        typeof value === 'object'
          ? readErrorText(value, depth + 1)
          : String(value),
      );
    return parts.join(' ');
  }
  return String(error);
};

/** True when a route/lazy import failed due to a missing or stale JS/CSS chunk. */
export const isChunkLoadError = (error: unknown): boolean =>
  CHUNK_LOAD_ERROR_RE.test(readErrorText(error));
