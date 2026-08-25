import { type MouseEvent, useCallback, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { UncontrolledTooltip } from 'reactstrap';
import { Copy } from 'lucide-react';

import { BaseButton } from './BaseButton';

/**
 * @param {string} code - The code/text to copy
 * @param {number} size - Icon size
 * @param {string} color - Bootstrap color name
 * @param {string} content - Tooltip content
 * @param {string} successMessage - Toast message on success
 */
interface CopyButtonProps {
  code: string;
  size?: number;
  color?: string;
  content?: string;
  successMessage?: string;
  className?: string;
}

export const CopyButton = ({
  code,
  size = 14,
  color = 'muted',
  content,
  successMessage,
  className,
}: CopyButtonProps) => {
  const { t } = useTranslation();
  const reactInstanceId = useId();

  const formatCode = useMemo(() => {
    return Number(code) ? `S${code}` : code;
  }, [code]);

  const tooltipTarget = useMemo(() => {
    const safeFormatCode = String(formatCode).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeInstanceId = String(reactInstanceId).replace(
      /[^a-zA-Z0-9_-]/g,
      '_',
    );
    return `copy-code-${safeFormatCode}-${safeInstanceId}`;
  }, [formatCode, reactInstanceId]);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast<string>(successMessage || t('common.codeCopied'), {
        type: 'success',
        autoClose: 200,
      });
    } catch (err) {
      console.error(err);
    }
  }, [code, successMessage, t]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleCopyCode();
    },
    [handleCopyCode],
  );

  return (
    <BaseButton
      color=""
      className={`p-0 border-0 text-${color} ${className || ''}`}
      disabled={!code}
      id={tooltipTarget}
      onClick={handleClick}
    >
      <Copy size={size} className="align-middle" />
      <UncontrolledTooltip target={tooltipTarget} fade={false} placement="top">
        {content || t('common.clickToCopy')}
      </UncontrolledTooltip>
    </BaseButton>
  );
};
