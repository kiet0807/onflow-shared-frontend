import { useCallback, useState } from 'react';

export interface UseToggleResult {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setValue: (_value: boolean) => void;
}

/**
 * Boolean toggle hook. Returns helpers to flip, open, close, or set the value.
 *
 * @example
 * ```ts
 * const modal = useToggle(false);
 * modal.onOpen();   // isOpen -> true
 * modal.onToggle(); // isOpen -> false
 * modal.onClose();  // isOpen -> false
 * ```
 */
export const useToggle = (initial = false): UseToggleResult => {
  const [isOpen, setOpen] = useState<boolean>(initial);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((prev) => !prev), []);
  const setValue = useCallback((value: boolean) => setOpen(value), []);
  return { isOpen, onOpen, onClose, onToggle, setValue };
};