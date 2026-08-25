import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'reactstrap';

import { createUploadQueries } from '../../queries/upload';

export interface FileUploadProps {
  value?: string | string[];
  onChange: (_val: unknown) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  title?: string;
  subTitle?: string;
  maxText?: string;
  hideFileList?: boolean;
  className?: string;
}

export const FileUpload = ({
  value,
  onChange,
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  title,
  subTitle,
  maxText,
  hideFileList = false,
  className = '',
}: FileUploadProps) => {
  const { t } = useTranslation('common');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      try {
        setUploading(true);
        const newUrls: string[] = [];

        const axiosLib = await import('axios');
        const api = axiosLib.default.create({ baseURL: '/api' });
        const { uploadFile } = createUploadQueries(api);

        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          const res = await uploadFile(formData);
          if (res?.data?.file) {
            newUrls.push(res.data.file);
          }
        }

        if (multiple) {
          const currentUrls = Array.isArray(value)
            ? value
            : value
              ? [value]
              : [];
          onChange([...currentUrls, ...newUrls]);
        } else {
          onChange(newUrls[newUrls.length - 1]);
        }
      } catch (err) {
        console.error('FileUpload: upload failed', err);
      } finally {
        setUploading(false);
      }
    },
    [multiple, onChange, value],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // react-dropzone v14+ accepts string | string[] | {mime: ext[]}; older versions
    // accept Record<string, string[]>. Cast keeps both happy.
    accept: accept as unknown as string | string[] | undefined,
    maxSize,
    multiple,
    disabled: disabled || uploading,
  });

  const urls = Array.isArray(value) ? value : value ? [value] : [];

  const handleRemove = (e: React.MouseEvent, urlToRemove: string) => {
    e.stopPropagation();
    if (multiple) {
      onChange(urls.filter((u) => u !== urlToRemove));
    } else {
      onChange('');
    }
  };

  const getFileName = (url: string) => {
    try {
      const parts = url.split('/');
      return parts[parts.length - 1] || 'File';
    } catch {
      return 'File';
    }
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border border-secondary-subtle rounded-3 p-4 py-3 text-center bg-secondary-subtle transition-all d-flex flex-column flex-grow-1 justify-content-center h-100 ${
          isDragActive ? 'border-primary bg-primary bg-opacity-10' : ''
        } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          {...getInputProps()}
          aria-label={title || t('fileUpload.uploadAria', 'Tải tệp lên')}
        />
        {uploading ? (
          <div className="py-3">
            <Spinner color="secondary" size="sm" className="mb-2" />
            <div className="fs-13 text-secondary">
              {t('common.uploading', 'Đang tải lên...')}
            </div>
          </div>
        ) : (
          <>
            <i className="ri-upload-cloud-2-line fs-28 text-secondary d-block mb-1" />
            <p className="mb-1 fs-13 fw-medium text-secondary">
              {title ||
                t('fileUpload.dropHint', 'Kéo thả file vào đây hoặc chọn file')}
            </p>
            <p className="mb-0 fs-12 text-secondary opacity-75">
              {subTitle}
              {subTitle && maxText && <br />}
              {maxText}
            </p>
          </>
        )}
      </div>

      {!hideFileList && urls.length > 0 && (
        <div className="mt-3 d-flex flex-column gap-2">
          {urls.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="d-flex align-items-center justify-content-between py-2 px-3 border rounded bg-white shadow-none"
            >
              <div className="d-flex align-items-center gap-3 overflow-hidden">
                <div className="avatar-xs flex-shrink-0">
                  <div className="avatar-title bg-primary-subtle text-primary rounded fs-16">
                    <i className="ri-file-text-line" />
                  </div>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-truncate fs-13 text-body fw-medium text-decoration-none d-block min-w-0px"
                  onClick={(e) => e.stopPropagation()}
                >
                  {getFileName(url)}
                </a>
              </div>
              {!disabled && (
                <button
                  type="button"
                  className="btn btn-sm btn-icon btn-soft-danger border-0 flex-shrink-0 ms-2 rounded-circle"
                  onClick={(e) => handleRemove(e, url)}
                  aria-label={t('fileUpload.removeAria', 'Xóa {{name}}', {
                    name: getFileName(url),
                  })}
                >
                  <i className="ri-delete-bin-line" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
