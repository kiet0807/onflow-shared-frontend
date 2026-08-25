import type { AxiosInstance } from 'axios';

export interface UploadResult {
  file: string;
  filename?: string;
  mime_type?: string;
  size?: number;
}

/**
 * Upload helper bound to the host's axios instance.
 *
 * The shared library does **not** pre-instantiate an axios client — the host
 * provides its own via {@link createUploadQueries}.
 */
export interface UploadQueries {
  uploadFile: (_formData: FormData) => Promise<{ data: UploadResult }>;
}

export const createUploadQueries = (
  api: AxiosInstance,
): UploadQueries => ({
  uploadFile: async (formData) => {
    const res = await api.post('/api/v1/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res as unknown as { data: UploadResult };
  },
});
