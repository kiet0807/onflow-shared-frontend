import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

export interface SearchTypeOption {
  value: string | number;
  label: string;
}

export interface SearchOptionInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'type'
> {
  value?: string;
  onChange?: (_val: string | undefined) => void;
  debounce?: number;
  className?: string;
  placeholder?: string;
  /** Dropdown options rendered before the search input */
  typeOptions?: readonly SearchTypeOption[];
  type?: string | number;
  onTypeChange?: (_option: SearchTypeOption) => void;
}

/**
 * Search input with an optional leading dropdown to select the search type.
 * Uses the same `input-group` pattern as DateTimeSelector.
 */
const SearchOptionInputInner = ({
  value,
  onChange,
  debounce = 0,
  className,
  placeholder,
  typeOptions = [],
  type,
  onTypeChange,
  ...rest
}: SearchOptionInputProps) => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState(value);
  const onChangeRef = useRef(onChange);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setKeyword(value || undefined);
  }, [value]);

  const typeItem = useMemo(() => {
    if (!Array.isArray(typeOptions) || !typeOptions.length) return undefined;
    if (type == null) return typeOptions[0];
    return typeOptions.find((item) => item.value === type) || typeOptions[0];
  }, [typeOptions, type]);

  useEffect(() => {
    if (!Array.isArray(typeOptions) || !typeOptions.length) return;
    if (!onTypeChange || type) return;
    onTypeChange(typeOptions[0]);
  }, [typeOptions, onTypeChange, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setKeyword(next);
    if (debounce === 0 && typeof onChange === 'function') {
      onChange(next || undefined);
    }
  };

  useEffect(() => {
    if (!debounce) return undefined;
    if (typeof onChangeRef.current !== 'function') return undefined;
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return undefined;
    }
    const timer = setTimeout(
      () => onChangeRef.current?.(keyword || undefined),
      debounce,
    );
    return () => clearTimeout(timer);
  }, [debounce, keyword]);

  return (
    <UncontrolledDropdown className={`input-group d-flex ${className || ''}`}>
      {typeOptions.length > 0 && (
        <>
          <DropdownToggle
            tag="div"
            className="input-group-text bg-light bg-opacity-75 pe-2 cursor-pointer"
          >
            <span className="text-truncate fs-13 fw-normal">
              {t(typeItem?.label || '')}
            </span>
            <i className="ri-arrow-down-s-line ms-1 fs-13"></i>
          </DropdownToggle>
          <DropdownMenu>
            {typeOptions.map((opt) => (
              <DropdownItem key={opt.value} onClick={() => onTypeChange?.(opt)}>
                {t(opt.label)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </>
      )}

      <input
        className="form-control"
        value={keyword || ''}
        onChange={handleChange}
        placeholder={
          placeholder ||
          (typeItem
            ? `${t('common.searchBy', 'Tìm kiếm theo')} ${t(typeItem.label).toLowerCase()}`
            : t('common.search'))
        }
        {...rest}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault();
        }}
      />
    </UncontrolledDropdown>
  );
};

export const SearchOptionInput = memo(SearchOptionInputInner);
