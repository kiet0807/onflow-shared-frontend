import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';

import { BaseButton } from '../buttons';
import { BrandedLoading } from '../displays/BrandedLoading';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface SecurePdfViewerProps {
  pdfUrl: string;
}

const SecurePdfViewerInner = ({ pdfUrl }: SecurePdfViewerProps) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.2);

  // Reset the page count when the source changes so stale pages from the
  // previous document don't render before the new one loads.
  useEffect(() => {
    setNumPages(null);
  }, [pdfUrl]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    [],
  );

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));

  return (
    <div
      className="position-relative w-100 h-100 overflow-hidden bg-light pdf-viewer-bg"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="w-100 h-100 overflow-auto py-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="pdf-viewer__loading">
              <BrandedLoading embedded />
            </div>
          }
        >
          {Array.from(new Array(numPages || 0), (_el, index) => (
            <div
              key={`page_${index + 1}`}
              className="d-flex justify-content-center mb-4 px-3"
            >
              <div className="shadow-lg rounded overflow-hidden bg-white">
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={scale}
                />
              </div>
            </div>
          ))}
        </Document>
      </div>

      {numPages && (
        <div className="pdf-glassmorphism-toolbar position-absolute bottom-0 start-50 translate-middle-x mb-4 px-2 py-2 rounded-pill shadow-lg d-flex align-items-center gap-2">
          <BaseButton
            color="light"
            size="sm"
            className="rounded-circle btn-icon shadow-none border-0 text-muted hover-primary"
            onClick={handleZoomOut}
            disabled={scale <= 0.6}
          >
            <i className="ri-zoom-out-line fs-16" />
          </BaseButton>

          <span className="fw-medium text-dark fs-13 px-3 border-start border-end border-light">
            {numPages} {t('common.pages', 'Trang')}
          </span>

          <BaseButton
            color="light"
            size="sm"
            className="rounded-circle btn-icon shadow-none border-0 text-muted hover-primary"
            onClick={handleZoomIn}
            disabled={scale >= 3}
          >
            <i className="ri-zoom-in-line fs-16" />
          </BaseButton>
        </div>
      )}
    </div>
  );
};

export const SecurePdfViewer = memo(SecurePdfViewerInner);
