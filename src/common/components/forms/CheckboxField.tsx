import type { Control, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Label } from 'reactstrap';

import { BaseInput } from '../../index';

export interface CheckboxFieldProps {
  control: Control<FieldValues>;
  name: string;
  label: string;
  id: string;
  disabled?: boolean;
}

export const CheckboxField = ({
  control,
  name,
  label,
  id,
  disabled = false,
}: CheckboxFieldProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <div className="form-check form-check-secondary">
        <BaseInput
          checked={!!field.value}
          onChange={field.onChange}
          type="checkbox"
          className="cursor-pointer"
          id={id}
          disabled={disabled}
        />
        <Label className="mb-0" htmlFor={id}>
          {label}
        </Label>
      </div>
    )}
  />
);
