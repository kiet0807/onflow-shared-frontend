import { useCallback, useId, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Spinner, UncontrolledTooltip } from 'reactstrap';
import classnames from 'classnames';

import { createUploadQueries } from '../../queries/upload';

import { ImageFallback } from '../displays/ImageFallback';

const DEFAULT_ACCEPT: Record<string, string[]> = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export interface ImageUploadProps {
  value?: string;
  onChange: (_value: string) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  previewSize?: number;
  disabled?: boolean;
}

export const ImageUpload = ({
  value,
  onChange,
  accept = DEFAULT_ACCEPT,
  maxSize = 5 * 1024 * 1024,
  previewSize = 108,
  disabled = false,
}: ImageUploadProps) => {
  const { t } = useTranslation('common');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const removeId = `img-remove-${useId().replace(/:/g, '_')}`;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setUploading(true);
        const axiosLib = await import('axios');
        const api = axiosLib.default.create({ baseURL: '/api' });
        const { uploadFile } = createUploadQueries(api);
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadFile(formData);
        if (res?.data?.file) onChange(res.data.file);
      } catch (err) {
        console.error('ImageUpload: upload failed', err);
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const { getInputProps } = useDropzone({
    onDrop,
    accept: accept as unknown as string | string[] | undefined,
    maxSize,
    multiple: false,
    disabled: disabled || uploading,
    noClick: true,
    noKeyboard: true,
    noDrag: true,
  });

  const hasImage = !!value;
  const canClick = !hasImage && !disabled && !uploading;

  const previewClasses = classnames(
    'image-upload__preview',
    'position-relative border rounded-3 bg-light',
    'd-flex align-items-center justify-content-center overflow-hidden',
    {
      'image-upload__preview--has-image': hasImage,
      'image-upload__preview--clickable': canClick,
    },
  );

  return (
    <div className="image-upload d-inline-flex flex-column position-relative">
      <div
        className={previewClasses}
        style={{ width: previewSize, height: previewSize }}
        onClick={canClick ? () => inputRef.current?.click() : undefined}
      >
        {uploading ? (
          <Spinner size="sm" color="primary" />
        ) : hasImage ? (
          <ImageFallback
            src={value}
            alt="Uploaded"
            className="img-fluid rounded object-fit-contain w-100 h-100"
          />
        ) : (
          <i className="ri-image-add-line text-muted fs-48" />
        )}
      </div>

      {hasImage && !disabled && (
        <>
          <button
            type="button"
            id={removeId}
            className="image-upload__remove position-absolute rounded-circle p-0 m-0 d-flex align-items-center justify-content-center"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
          >
            <i className="ri-close-line text-white" />
          </button>
          <UncontrolledTooltip target={removeId} placement="top" fade={false}>
            {t('common.removeImage')}
          </UncontrolledTooltip>
        </>
      )}

      <input {...getInputProps()} ref={inputRef} />
    </div>
  );
};
