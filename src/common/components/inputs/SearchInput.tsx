import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> {
  value?: string;
  onChange?: (_val: string) => void;
  debounce?: number;
  className?: string;
  placeholder?: string;
}

/**
 * Common search input with optional debounce + search trigger.
 * Backward compatible: immediate onChange, prevents Enter default.
 */
export const SearchInput = ({
  value,
  onChange,
  debounce = 0,
  className,
  placeholder,
  ...rest
}: SearchInputProps) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setKeyword(next);
    if (debounce === 0 && typeof onChange === 'function') {
      onChange(next);
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
      () => onChangeRef.current?.(keyword ?? ''),
      debounce,
    );
    return () => clearTimeout(timer);
  }, [debounce, keyword]);

  return (
    <div className="search-box">
      <input
        className={`form-control ${className || ''}`}
        value={keyword || ''}
        onChange={handleChange}
        placeholder={placeholder || t('common.search')}
        {...rest}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      />
      <i className="ri-search-line search-icon"></i>
    </div>
  );
};
