import { useCallback, useEffect, useId, useState } from 'react';
import Dropzone from 'react-dropzone';
import { UncontrolledTooltip } from 'reactstrap';

import { ImageFallback } from '../displays/ImageFallback';

const ACCEPTED_IMAGE_TYPES: Record<string, string[]> = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
};

export interface AvatarUploadProps {
  value?: string | { preview?: string } | null;
  onChange: (data: { file: File; preview: string }) => void;
  initials?: string;
  altText?: string;
  size?: 'lg' | 'xl';
  tooltipText?: string;
}

/**
 * AvatarUpload — Circular avatar with click-to-upload functionality.
 * Supports both URL strings and File objects as value.
 */
export const AvatarUpload = ({
  value,
  onChange,
  initials = 'DN',
  altText = '',
  size = 'lg',
  tooltipText,
}: AvatarUploadProps) => {
  const tooltipId = useId().replace(/:/g, '_');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize previewUrl from value if it's a string
  useEffect(() => {
    if (typeof value === 'string') {
      setPreviewUrl(value);
    } else if (value?.preview) {
      setPreviewUrl(value.preview);
    } else if (!value) {
      setPreviewUrl(null);
    }
  }, [value]);

  // Cleanup ObjectURL on unmount or preview change
  useEffect(() => {
    return () => {
      // Only revoke if it's a blob URL
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onUploadImg = useCallback(
    (files: File[]) => {
      const [file] = files;
      if (!file) return;

      const newPreview = URL.createObjectURL(file);

      // Update local state to show immediately
      setPreviewUrl(newPreview);

      // Pass the file and preview back to parent
      onChange({ file, preview: newPreview });
    },
    [onChange],
  );

  const avatarClass = size === 'xl' ? 'avatar-xl' : 'avatar-lg';

  return (
    <Dropzone
      // react-dropzone typing has shifted across major versions — the legacy
      // Record<string, string[]> shape and the newer string | string[] shape
      // both produce the same runtime behavior, so we cast to the wider union.
      accept={ACCEPTED_IMAGE_TYPES as unknown as never}
      onDrop={onUploadImg}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className="cursor-pointer profile-user d-inline-block position-relative"
        >
          <div className="position-relative d-inline-block">
            <div className="bg-white bg-opacity-10 p-1 rounded-circle shadow-sm border">
              {previewUrl ? (
                <ImageFallback
                  src={previewUrl}
                  alt={altText}
                  className={`rounded-circle ${avatarClass} object-cover`}
                />
              ) : size === 'xl' ? (
                <div className="avatar-xl bg-primary rounded-circle d-flex align-items-center justify-content-center">
                  <span className="fs-36 text-uppercase text-white fw-medium">
                    {initials}
                  </span>
                </div>
              ) : (
                <div className="rounded-circle avatar-lg bg-white d-flex align-items-center justify-content-center text-warning">
                  <span className="fs-20 text-uppercase fw-bold">
                    {initials}
                  </span>
                </div>
              )}
            </div>
            <div
              className="position-absolute bottom-0 end-0"
              style={{
                transform: size === 'xl' ? 'translate(0%, 0%)' : 'none',
              }}
              id={tooltipText ? `avatar-upload-${tooltipId}` : undefined}
            >
              <div className="avatar-xs cursor-pointer hover-scale">
                <span className="avatar-title rounded-circle bg-primary text-white shadow border border-2 border-white">
                  <i className="ri-camera-fill fs-12" />
                </span>
              </div>
            </div>

            {tooltipText && (
              <UncontrolledTooltip
                target={`avatar-upload-${tooltipId}`}
                placement="top"
                fade={false}
              >
                {tooltipText}
              </UncontrolledTooltip>
            )}

            <input {...getInputProps()} className="d-none" />
          </div>
        </div>
      )}
    </Dropzone>
  );
};
