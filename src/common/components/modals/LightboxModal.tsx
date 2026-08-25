import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody } from 'reactstrap';

import { useToggle } from '../../hooks';

export interface LightboxImageObject {
  image_url?: string;
  url?: string;
  src?: string;
}

export type LightboxImage = string | LightboxImageObject;

export interface LightboxModalProps {
  isOpen?: boolean;
  onClose: () => void;
  images?: LightboxImage[];
  currentIndex?: number;
  setCurrentIndex: (_index: number) => void;
}

/**
 * LightboxModal — Reusable premium image gallery modal with zoom, rotate, and flip capabilities.
 */
export const LightboxModal = ({
  isOpen = false,
  onClose,
  images = [],
  currentIndex = 0,
  setCurrentIndex,
}: LightboxModalProps) => {
  const { t } = useTranslation('common');
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const {
    isOpen: flipH,
    onToggle: toggleFlipH,
    onClose: resetFlipH,
  } = useToggle(false);
  const {
    isOpen: flipV,
    onToggle: toggleFlipV,
    onClose: resetFlipV,
  } = useToggle(false);

  const resetTransform = useCallback(() => {
    setZoom(1);
    setRotate(0);
    resetFlipH();
    resetFlipV();
  }, [resetFlipH, resetFlipV]);

  // Reset transforms whenever the image changes
  useEffect(() => {
    resetTransform();
  }, [currentIndex, resetTransform]);

  if (!isOpen || currentIndex === null || !images[currentIndex]) return null;

  const currentImg = images[currentIndex];
  const imageUrl =
    typeof currentImg === 'string'
      ? currentImg
      : currentImg?.image_url || currentImg?.url || currentImg?.src || '';

  const handleClose = () => {
    onClose?.();
    resetTransform();
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex?.(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex?.(currentIndex + 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      centered
      size="lg"
      className="modal-dialog-centered"
      contentClassName="border-0 bg-transparent"
    >
      <ModalBody className="p-0 position-relative bg-dark rounded-3 overflow-hidden min-h-50vh">
        {/* Image Container with overflow hidden */}
        <div className="d-flex align-items-center justify-content-center bg-black position-relative h-75vh overflow-hidden">
          <img
            src={imageUrl}
            alt={`Lightbox #${currentIndex + 1}`}
            className="lightbox-img"
            style={{
              transform: `scale(${zoom}) rotate(${rotate}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
            }}
          />
        </div>

        {/* Toolbar */}
        <div className="position-absolute top-0 start-50 translate-middle-x mt-3 d-flex align-items-center gap-2 bg-dark bg-opacity-75 rounded-pill px-3 py-1 border-0 shadow-sm lightbox-toolbar">
          {/* Zoom Out */}
          <button
            type="button"
            className="text-white-50 p-1 hover-text-white border-0 bg-transparent shadow-none transition-smooth d-flex align-items-center lightbox-toolbar-btn"
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
            title={t('lightbox.zoomOut', 'Thu nhỏ')}
          >
            <i className="ri-zoom-out-line fs-17" />
          </button>
          {/* Zoom In */}
          <button
            type="button"
            className="text-white-50 p-1 hover-text-white border-0 bg-transparent shadow-none transition-smooth d-flex align-items-center lightbox-toolbar-btn"
            onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
            title={t('lightbox.zoomIn', 'Phóng to')}
          >
            <i className="ri-zoom-in-line fs-17" />
          </button>
          {/* Divider */}
          <span className="text-white-50 opacity-25">|</span>
          {/* Rotate Left */}
          <button
            type="button"
            className="text-white-50 p-1 hover-text-white border-0 bg-transparent shadow-none transition-smooth d-flex align-items-center lightbox-toolbar-btn"
            onClick={() => setRotate((r) => r - 90)}
            title={t('lightbox.rotateLeft', 'Xoay trái')}
          >
            <i className="ri-anticlockwise-line fs-17" />
          </button>
          {/* Rotate Right */}
          <button
            type="button"
            className="text-white-50 p-1 hover-text-white border-0 bg-transparent shadow-none transition-smooth d-flex align-items-center lightbox-toolbar-btn"
            onClick={() => setRotate((r) => r + 90)}
            title={t('lightbox.rotateRight', 'Xoay phải')}
          >
            <i className="ri-clockwise-line fs-17" />
          </button>
          {/* Divider */}
          <span className="text-white-50 opacity-25">|</span>
          {/* Flip Horizontal */}
          <button
            type="button"
            className="text-white-50 p-1 hover-text-white border-0 bg-transparent shadow-none transition-smooth d-flex align-items-center lightbox-toolbar-btn"
            onClick={toggleFlipH}
            title={t('lightbox.flipHorizontal', 'Lật ngang')}
          >
            <i className="ri-arrow-left-right-line fs-17" />
          </button>
          {/* Flip Vertical */}
          <button
            type="button"
            className="text-white-50 p-1 hover-text-white border-0 bg-transparent shadow-none transition-smooth d-flex align-items-center lightbox-toolbar-btn"
            onClick={toggleFlipV}
            title={t('lightbox.flipVertical', 'Lật dọc')}
          >
            <i className="ri-arrow-up-down-line fs-17" />
          </button>
          {/* Divider */}
          <span className="text-white-50 opacity-25">|</span>
          {/* Reset */}
          <button
            type="button"
            className="text-white-50 p-1 hover-text-white border-0 bg-transparent shadow-none transition-smooth d-flex align-items-center lightbox-toolbar-btn"
            onClick={resetTransform}
            title={t('lightbox.reset', 'Khôi phục')}
          >
            <i className="ri-refresh-line fs-17" />
          </button>
        </div>

        {/* Close button */}
        <button
          type="button"
          className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3"
          onClick={handleClose}
        />

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="btn btn-dark bg-opacity-50 position-absolute start-0 top-50 translate-middle-y ms-2 rounded-circle d-flex align-items-center justify-content-center z-3 lightbox-nav-btn"
              disabled={currentIndex === 0}
              onClick={handlePrev}
            >
              <i className="ri-arrow-left-s-line fs-20 text-white" />
            </button>
            <button
              type="button"
              className="btn btn-dark bg-opacity-50 position-absolute end-0 top-50 translate-middle-y me-2 rounded-circle d-flex align-items-center justify-content-center z-3 lightbox-nav-btn"
              disabled={currentIndex === images.length - 1}
              onClick={handleNext}
            >
              <i className="ri-arrow-right-s-line fs-20 text-white" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 z-3">
          <span className="badge bg-dark bg-opacity-75 text-white fs-12 px-3 py-1 rounded-pill">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </ModalBody>
    </Modal>
  );
};
