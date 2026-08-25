import { EMPTY_VALUE } from '../../constants';

export type DownloadFileItem =
  | string
  | {
      url: string;
      fileName?: string;
    };

const normalizeDownloadItem = (
  item: DownloadFileItem,
): { url: string; fileName?: string } =>
  typeof item === 'string' ? { url: item } : item;

/**
 * Trigger a browser download from in-memory binary data (ArrayBuffer, Blob, …).
 * Creates an object URL, clicks a temporary `<a download>`, then revokes it.
 */
export const downloadBlob = (
  data: BlobPart | BlobPart[],
  fileName: string,
  mimeType?: string,
) => {
  const blob =
    data instanceof Blob
      ? data
      : new Blob(Array.isArray(data) ? data : [data], {
          ...(mimeType ? { type: mimeType } : {}),
        });
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(objectUrl);
};

/**
 * Trigger a browser download for a given remote file URL.
 * When `fileName` is provided, fetches the file as a blob so the saved name
 * is applied reliably (cross-origin `download` on <a> is often ignored).
 */
export const downloadFromUrl = async (url: string, fileName?: string) => {
  if (!url) return;

  if (fileName) {
    try {
      const response = await fetch(url, { credentials: 'omit' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      downloadBlob(blob, fileName);
      return;
    } catch {
      // CORS/network — fall back to opening the remote URL directly.
    }
  }

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName || '');
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/** Default gap between consecutive downloads (ms). */
const DEFAULT_DOWNLOAD_DELAY_MS = 400;

/**
 * Download multiple file URLs one by one with a short gap between each.
 * Triggering many downloads in the same tick gets blocked by the popup
 * blocker (each link opens with target="_blank"), so we space them out.
 */
export const downloadFilesSequentially = async (
  files: DownloadFileItem[],
  delayMs: number = DEFAULT_DOWNLOAD_DELAY_MS,
) => {
  for (let i = 0; i < files.length; i += 1) {
    const { url, fileName } = normalizeDownloadItem(files[i]);
    await downloadFromUrl(url, fileName);
    if (i < files.length - 1) {
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

export const parseFileFromUrl = (url: string | null | undefined) => {
  if (!url) return { filename: EMPTY_VALUE, extension: '' };
  try {
    const decoded = decodeURIComponent(url);
    const cleanUrl = decoded.split('?')[0];

    // Extract filename
    const urlParts = cleanUrl.split('/');
    const filename = urlParts[urlParts.length - 1] || decoded;

    // Extract extension
    const fileParts = cleanUrl.split('.');
    const rawExt = fileParts[fileParts.length - 1];
    const extension = rawExt ? rawExt.toUpperCase() : '';

    return { filename, extension };
  } catch (e) {
    return { filename: url, extension: '' };
  }
};
