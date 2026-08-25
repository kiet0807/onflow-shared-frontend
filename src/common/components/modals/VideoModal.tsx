import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody } from 'reactstrap';

export interface VideoModalProps {
  isOpen?: boolean;
  onClose: () => void;
  url?: string;
}

export const VideoModal = ({
  isOpen = false,
  onClose,
  url,
}: VideoModalProps) => {
  const { t } = useTranslation('common');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClose = useCallback(() => {
    videoRef.current?.pause();
    onClose();
  }, [onClose]);

  const handleOpenInNewTab = useCallback(() => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }, [url]);

  if (!isOpen || !url) return null;

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      centered
      size="xl"
      className="modal-dialog-centered"
      contentClassName="border-0 bg-transparent"
    >
      <ModalBody className="p-0 position-relative bg-dark rounded-3 overflow-hidden min-h-50vh">
        <div className="d-flex align-items-center justify-content-center bg-black position-relative h-75vh overflow-hidden">
          <video
            ref={videoRef}
            key={url}
            controls
            autoPlay
            playsInline
            className="video-modal-player"
          >
            <source src={url} type="video/mp4" />
            {t('videoModal.unsupported')}
          </video>
        </div>

        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex align-items-center gap-2 bg-dark bg-opacity-75 rounded-pill px-3 py-1 border-0 shadow-sm lightbox-toolbar">
          <button
            type="button"
            className="text-white-50 p-1 hover-text-white border-0 bg-transparent shadow-none transition-smooth d-flex align-items-center lightbox-toolbar-btn"
            onClick={handleOpenInNewTab}
            title={t('videoModal.openInNewTab')}
          >
            <i className="ri-external-link-line fs-17" />
          </button>
        </div>

        <button
          type="button"
          className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3"
          onClick={handleClose}
          aria-label={t('videoModal.close')}
        />
      </ModalBody>
    </Modal>
  );
};
