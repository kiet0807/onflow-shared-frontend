import type { ChangeEvent, KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { decimalFieldProps, integerFieldProps } from '../ui/form';

describe('integerFieldProps', () => {
  it('renders empty string for nullish values', () => {
    const props = integerFieldProps(vi.fn(), null);
    expect(props.value).toBe('');
  });

  it('blocks decimal separators on keydown', () => {
    const preventDefault = vi.fn();
    const props = integerFieldProps(vi.fn(), 12);

    props.onKeyDown({
      key: '.',
      preventDefault,
    } as unknown as KeyboardEvent<HTMLInputElement>);

    expect(preventDefault).toHaveBeenCalled();
  });

  it('strips non-digits and converts to number', () => {
    const onChange = vi.fn();
    const props = integerFieldProps(onChange, '');

    props.onChange({
      target: { value: '12a3' },
    } as ChangeEvent<HTMLInputElement>);

    expect(onChange).toHaveBeenCalledWith(123);
  });

  it('returns empty string when input is cleared', () => {
    const onChange = vi.fn();
    const props = integerFieldProps(onChange, 10);

    props.onChange({
      target: { value: '' },
    } as ChangeEvent<HTMLInputElement>);

    expect(onChange).toHaveBeenCalledWith('');
  });
});

describe('decimalFieldProps', () => {
  it('accepts comma as decimal separator', () => {
    const onChange = vi.fn();
    const props = decimalFieldProps(onChange, '');

    props.onChange({
      target: { value: '12,5' },
    } as ChangeEvent<HTMLInputElement>);

    expect(onChange).toHaveBeenCalledWith('12.5');
  });

  it('rejects values exceeding max decimal places', () => {
    const onChange = vi.fn();
    const props = decimalFieldProps(onChange, '', 2);

    props.onChange({
      target: { value: '1.234' },
    } as ChangeEvent<HTMLInputElement>);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('allows values within max decimal places', () => {
    const onChange = vi.fn();
    const props = decimalFieldProps(onChange, '', 2);

    props.onChange({
      target: { value: '1.23' },
    } as ChangeEvent<HTMLInputElement>);

    expect(onChange).toHaveBeenCalledWith('1.23');
  });
});
