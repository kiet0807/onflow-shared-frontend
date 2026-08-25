import { useTranslation } from 'react-i18next';
import { Modal, ModalBody } from 'reactstrap';
import { AlertTriangle } from 'lucide-react';

import { BaseButton } from '../buttons';

export interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title: React.ReactNode;
  doAction: () => void;
  hiddenYes?: boolean;
  headerTitle?: string;
  note?: string;
  closeToast?: () => void;
}

/**
 * ConfirmModal — Confirmation dialog with Yes/No actions.
 * Controlled component: parent manages `isOpen` and `onClose`.
 */
export const ConfirmModal = ({
  isOpen = false,
  onClose,
  title,
  doAction,
  hiddenYes = false,
  headerTitle,
  note = '',
  closeToast,
}: ConfirmModalProps) => {
  const { t } = useTranslation();
  const defaultHeaderTitle = t('common.areYouSure');

  const handleClose = () => {
    onClose?.();
    closeToast?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      className="warning-modal--high-z"
      aria-labelledby="confirm-modal-title"
    >
      <ModalBody className="text-center p-5">
        <AlertTriangle
          size={80}
          className="text-warning mb-3"
          strokeWidth={1.5}
        />
        <div className="mt-4">
          <h4 className="mb-3" id="confirm-modal-title">
            {headerTitle || defaultHeaderTitle}
          </h4>
          <p className="text-muted mb-4">{title}</p>
          {note && <p className="fw-semibold fs-13 mb-4">{note}</p>}
          <div className="hstack gap-2 justify-content-center">
            <BaseButton color="light" onClick={handleClose}>
              {t('common.no')}
            </BaseButton>
            <BaseButton
              hidden={hiddenYes}
              className="mx-1"
              color="danger"
              onClick={() => {
                doAction?.();
                handleClose();
              }}
            >
              {t('common.yes')}
            </BaseButton>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
