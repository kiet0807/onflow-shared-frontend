import type { ReactNode } from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface CapsuleOption {
  value: string | number;
  label: string;
  color?: string;
}

export interface CapsuleSelectorProps {
  label?: ReactNode;
  options?: CapsuleOption[];
  value?: string | number | (string | number)[];
  onChange?: (_value: string | number | string[] | undefined) => void;
  multiple?: boolean;
  maxCollapsed?: number;
  activeAllOnEmpty?: boolean;
  className?: string;
}

const CapsuleSelectorInner = ({
  label,
  options = [],
  value = [],
  onChange,
  multiple = true,
  maxCollapsed = 6,
  activeAllOnEmpty = false,
  className = '',
}: CapsuleSelectorProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Normalize selected values to an array of strings
  const selectedValues = useMemo(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      if (activeAllOnEmpty) {
        return options.map((opt) => String(opt.value));
      }
      return [];
    }
    if (Array.isArray(value)) return value.map(String);
    return String(value)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [value, options, activeAllOnEmpty]);

  // Auto-expand if a selected item is currently hidden (index >= maxCollapsed)
  useEffect(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return;
    }
    const hasActiveHiddenOption = options.slice(maxCollapsed).some((opt) => {
      const valStr = String(opt.value);
      return selectedValues.includes(valStr);
    });
    if (hasActiveHiddenOption) {
      setIsExpanded(true);
    }
  }, [options, value, maxCollapsed, selectedValues]);

  const handleToggle = useCallback(
    (optVal: string | number) => {
      const valStr = String(optVal);

      if (!multiple) {
        const isSelected = selectedValues.includes(valStr);
        onChange?.(
          isSelected
            ? Array.isArray(value)
              ? []
              : undefined
            : Array.isArray(value)
              ? [valStr]
              : optVal,
        );
        return;
      }

      const nextValues = selectedValues.includes(valStr)
        ? selectedValues.filter((v) => v !== valStr)
        : [...selectedValues, valStr];

      // Clear filter when none are selected
      if (nextValues.length === 0) {
        onChange?.(undefined);
      } else {
        onChange?.(Array.isArray(value) ? nextValues : nextValues.join(','));
      }
    },
    [multiple, selectedValues, value, onChange],
  );

  if (!options || options.length === 0) return null;

  return (
    <div
      className={`capsule-selector filter-row border-bottom border-bottom-dashed ${className}`}
    >
      {label && (
        <div className="filter-label">
          {typeof label === 'string' ? t(label) : label}:
        </div>
      )}
      <div
        className={`filter-capsules-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}
      >
        {options.map((opt) => {
          const active = selectedValues.includes(String(opt.value));
          const bgColor =
            active && opt.color ? `filter-capsule--${opt.color}` : '';
          return (
            <div
              key={opt.value}
              className={`filter-capsule hover-scale ${active ? 'active' : ''} ${bgColor}`}
              onClick={() => handleToggle(opt.value)}
            >
              {active && <i className="ri-check-line" />}
              <span>{t(opt.label)}</span>
            </div>
          );
        })}
      </div>
      {options.length > maxCollapsed && (
        <button
          type="button"
          className="filter-more-btn w-110px"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <span>
            {isExpanded
              ? t('common.showLess', 'Ẩn bớt')
              : t('common.showMore', 'Xem thêm')}
          </span>
          <i
            className={
              isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
            }
          />
        </button>
      )}
    </div>
  );
};

export const CapsuleSelector = memo(CapsuleSelectorInner);
