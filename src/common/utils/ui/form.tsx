import type { ChangeEvent, KeyboardEvent } from 'react';
import type { FieldValues, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { AnyObjectSchema } from 'yup';

/**
 * Wraps `yupResolver` and casts it to the form's `Resolver<T>`, centralizing the
 * yup ↔ react-hook-form type mismatch in one place instead of casting at every
 * `useForm` call site.
 *
 * @example
 * const form = useForm<FormData>({
 *   resolver: createYupResolver<FormData>(getSchema(t)),
 *   defaultValues: getDefaults(),
 * });
 */
export const createYupResolver = <T extends FieldValues>(
  schema: AnyObjectSchema,
): Resolver<T> => yupResolver(schema) as unknown as Resolver<T>;

/**
 * Returns props for a BaseInput that only accepts integer values.
 * Blocks decimal separators and strips non-digit characters.
 */
export const integerFieldProps = (
  onChange: (value: number | string) => void,
  value: unknown,
) => ({
  type: 'text' as const,
  value: value !== '' && value != null ? String(value) : '',
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '.' || e.key === ',') e.preventDefault();
  },
  onChange: (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    onChange(raw ? Number(raw) : '');
  },
});

/**
 * Returns props for a BaseInput that accepts decimal values.
 * Replaces comma with dot and restricts the number of decimal places.
 */
export const decimalFieldProps = (
  onChange: (value: string) => void,
  value: unknown,
  maxDecimals: number = 3,
) => ({
  type: 'text' as const,
  value: value !== '' && value != null ? String(value) : '',
  onChange: (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(',', '.');
    const regex = new RegExp(`^\\d*(\\.\\d{0,${maxDecimals}})?$`);
    if (val === '' || regex.test(val)) {
      onChange(val);
    }
  },
});
