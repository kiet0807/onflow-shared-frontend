declare module 'react-flatpickr' {
  import type { ComponentType, CSSProperties } from 'react';

  export interface FlatpickrOptions {
    mode?: 'single' | 'range' | 'multiple';
    dateFormat?: string;
    altFormat?: string;
    minDate?: Date | string;
    maxDate?: Date | string;
    enableTime?: boolean;
    time_24hr?: boolean;
    locale?: unknown;
    defaultDate?: Date | Date[] | string | string[];
    [key: string]: unknown;
  }

  export interface FlatpickrProps {
    value?: Date | Date[] | string | string[] | number | number[];
    defaultValue?: Date | Date[] | string | string[];
    options?: FlatpickrOptions;
    onChange?: (_dates: Date[], _dateStr: string, _instance: unknown) => void;
    placeholder?: string;
    className?: string;
    style?: CSSProperties;
    disabled?: boolean;
    name?: string;
    id?: string;
  }

  const Flatpickr: ComponentType<FlatpickrProps>;
  export default Flatpickr;
}