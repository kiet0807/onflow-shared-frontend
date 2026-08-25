import { memo, useCallback, useEffect, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import { useTranslation } from 'react-i18next';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { Vietnamese } from 'flatpickr/dist/l10n/vn';

import { useLocalStorage } from '../../hooks';
import { formatDateTime, formatTimeStamp } from '../../utils';
import { LOCAL_STORAGE_KEY } from '../../../core/config/local-storage-key';

export interface DateTypeOption {
  value: string | number;
  label: string;
}

interface FlatpickrOptions {
  mode?: 'single' | 'range' | 'multiple';
  dateFormat?: string;
  maxDate?: Date;
  minDate?: Date;
  enableTime?: boolean;
  time_24hr?: boolean;
  locale?: unknown;
}

export interface DateTimeSelectorProps {
  value?: number[];
  onChange?: (_dates: number[] | null) => void;
  className?: string;
  type?: string | number;
  typeOptions?: readonly DateTypeOption[];
  onTypeChange?: (_option: DateTypeOption) => void;
  options?: FlatpickrOptions;
  height?: string | number;
  isError?: boolean;
}

const DateTimeSelectorInner = ({
  value = [],
  onChange,
  className,
  type,
  typeOptions = [],
  onTypeChange,
  options = {},
  height,
  isError = false,
}: DateTimeSelectorProps) => {
  const { t } = useTranslation();
  const [language] = useLocalStorage<string>(LOCAL_STORAGE_KEY.i18nextLng);

  const mergedOptions = useMemo<FlatpickrOptions>(
    () => ({
      mode: 'range',
      dateFormat: 'd-m-Y',
      maxDate: new Date(),
      time_24hr: true,
      ...options,
    }),
    [options],
  );

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);

  const endOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

  const formatDateValue = useMemo<string | string[] | undefined>(() => {
    if (!Array.isArray(value) || value.length === 0) return undefined;

    if (mergedOptions.mode === 'range') {
      const dates: string[] = [];
      if (value[0]) {
        dates.push(formatDateTime(value[0] * 1000, 'DD-MM-YYYY HH:mm:ss'));
      }
      if (value[1]) {
        dates.push(formatDateTime(value[1] * 1000, 'DD-MM-YYYY HH:mm:ss'));
      }
      return dates;
    }

    if (value[0]) {
      return formatDateTime(value[0] * 1000, 'DD-MM-YYYY HH:mm:ss');
    }
    return undefined;
  }, [mergedOptions.mode, value]);

  const typeItem = useMemo<DateTypeOption | undefined>(() => {
    if (!Array.isArray(typeOptions) || !typeOptions.length) return undefined;
    if (type == null) return typeOptions[0];
    return typeOptions.find((item) => item.value === type) ?? typeOptions[0];
  }, [typeOptions, type]);

  useEffect(() => {
    if (!Array.isArray(typeOptions) || !typeOptions.length) return;
    if (!onTypeChange || type != null) return;
    onTypeChange(typeOptions[0]);
  }, [typeOptions, onTypeChange, type]);

  const onDateChange = useCallback(
    (dates: Date[]) => {
      if (!dates || dates.length === 0) {
        return onChange?.(null);
      }

      if (mergedOptions.mode === 'range') {
        if (dates.length < 2) return;

        const startHours = dates[0].getHours();
        const startMinutes = dates[0].getMinutes();
        const isStartDefaultTime = startHours === 12 && startMinutes === 0;
        const start =
          mergedOptions.enableTime && !isStartDefaultTime
            ? dates[0]
            : startOfDay(dates[0]);

        const endHours = dates[1].getHours();
        const endMinutes = dates[1].getMinutes();
        const isEndDefaultTime = endHours === 12 && endMinutes === 0;
        const end =
          mergedOptions.enableTime && !isEndDefaultTime
            ? dates[1]
            : endOfDay(dates[1]);

        const startTs = formatTimeStamp(start);
        const endTs = formatTimeStamp(end);
        if (startTs != null && endTs != null) {
          onChange?.([startTs, endTs]);
        }
        return;
      }

      const singleTs = formatTimeStamp(dates[0]);
      if (singleTs != null) onChange?.([singleTs]);
    },
    [mergedOptions.mode, mergedOptions.enableTime, onChange],
  );

  const flatpickrLocale = language === 'vi' ? Vietnamese : undefined;

  return (
    <UncontrolledDropdown
      className={['input-group d-flex', className].filter(Boolean).join(' ')}
    >
      {typeOptions.length === 1 && (
        <div
          className={[
            'input-group-text bg-light bg-opacity-75 pe-3 border-end-0',
            isError ? 'border-danger' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ height, cursor: 'default' }}
        >
          <span className="text-truncate fs-13 fw-normal">
            {typeItem ? t(typeItem.label) : ''}
          </span>
        </div>
      )}
      {typeOptions.length > 1 && (
        <>
          <DropdownToggle
            tag="div"
            className={[
              'input-group-text bg-light bg-opacity-75 pe-2',
              isError ? 'border-danger' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ height }}
          >
            <span className="text-truncate fs-13 fw-normal">
              {typeItem ? t(typeItem.label) : ''}
            </span>
            <i className="ri-arrow-down-s-line ms-1 fs-13" />
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

      <Flatpickr
        className={['form-control', isError ? 'border-danger z-1' : '']
          .filter(Boolean)
          .join(' ')}
        options={{
          ...mergedOptions,
          locale: flatpickrLocale,
        }}
        value={formatDateValue}
        onChange={onDateChange}
        placeholder={t('common.chooseDate')}
        style={{ height }}
      />
      <div
        className={[
          'input-group-text bg-primary text-white',
          isError ? 'border-danger' : 'border-primary',
        ].join(' ')}
        style={{ height }}
      >
        <i className="ri-calendar-2-line" />
      </div>
    </UncontrolledDropdown>
  );
};

export const DateTimeSelector = memo(DateTimeSelectorInner);
