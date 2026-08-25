import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { InputProps } from 'reactstrap';
import { Input } from 'reactstrap';
import { Eye, EyeOff } from 'lucide-react';

export interface BaseInputProps extends Omit<InputProps, 'prefix'> {
  isError?: boolean;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  groupClassName?: string;
  innerRef?: React.Ref<HTMLInputElement>;
}

/**
 * BaseInput — Wrapper around Reactstrap Input with password toggle,
 * prefix/suffix input-group support, and error styling.
 */
const BaseInputInner = (
  {
    isError = false,
    className = '',
    type = 'text',
    suffix = '',
    prefix = '',
    groupClassName = '',
    innerRef,
    bsSize,
    ...props
  }: BaseInputProps,
  ref: React.Ref<HTMLInputElement>,
) => {
  const { t } = useTranslation('common');
  const [showPassword, setShowPassword] = useState(false);

  const errorClass = isError ? 'border border-danger' : '';
  const typeClass =
    type === 'password'
      ? 'form-control-icon'
      : type === 'checkbox'
        ? 'form-check-input'
        : 'form-control';

  const sizeClass = bsSize === 'sm' ? 'h-30px fs-13 px-2' : '';

  const inputElement = (
    <Input
      {...props}
      bsSize={bsSize}
      type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
      className={`${typeClass} ${errorClass} ${sizeClass} ${className}`.trim()}
      innerRef={ref || innerRef}
      aria-invalid={isError || undefined}
    />
  );

  if (type !== 'password' && !suffix && !prefix) {
    return inputElement;
  }

  return (
    <div
      className={[
        type === 'password' ? 'form-icon right' : '',
        suffix || prefix ? 'input-group flex-nowrap' : '',
        (suffix || prefix) && bsSize ? `input-group-${bsSize}` : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {prefix && (
        <span
          className={`input-group-text ${sizeClass} ${groupClassName}`.trim()}
        >
          {prefix}
        </span>
      )}
      {inputElement}
      {type === 'password' && (
        <span
          className="cursor-pointer text-muted d-flex align-items-center base-input__password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          role="button"
          aria-label={
            showPassword
              ? t('baseInput.hidePassword', 'Ẩn mật khẩu')
              : t('baseInput.showPassword', 'Hiện mật khẩu')
          }
        >
          {showPassword ? (
            <EyeOff size={sizeClass ? 12 : 16} />
          ) : (
            <Eye size={sizeClass ? 12 : 16} />
          )}
        </span>
      )}
      {suffix && (
        <span
          className={`input-group-text ${sizeClass} ${groupClassName}`.trim()}
        >
          {suffix}
        </span>
      )}
    </div>
  );
};

export const BaseInput = forwardRef(BaseInputInner);
BaseInput.displayName = 'BaseInput';
