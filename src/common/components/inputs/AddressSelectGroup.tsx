import { useCallback, useEffect } from 'react';
import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { Col, Label, Row } from 'reactstrap';

import { useAddressSelector } from '../../hooks';
import { createAddressQueries, type GetWardParams, type WardItem } from '../../queries/address';
import type { AddressOption } from '../../types/address.types';
import { customSelectStyles } from '../../utils';

import { FieldErrorText } from '../forms';

export type { AddressOption } from '../../types/address.types';

export interface AddressSelectGroupProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
  prefix?: string;
  layout?: 'vertical' | 'horizontal';
  isRequired?: boolean;
  labelTextColor?: string;
  initialValues?: {
    provinceId?: string | number;
    districtId?: string | number;
    wardId?: string | number;
  };
  version?: 'current' | 'legacy';
}

export const AddressSelectGroup = <T extends FieldValues>({
  control,
  watch,
  setValue,
  errors,
  prefix = 'business',
  layout = 'vertical',
  isRequired = false,
  labelTextColor,
  initialValues,
  version = 'legacy',
}: AddressSelectGroupProps<T>) => {
  const { t } = useTranslation('common');

  const provinceField = `${prefix}Province` as Path<T>;
  const districtField = `${prefix}District` as Path<T>;
  const wardField = `${prefix}Ward` as Path<T>;

  const setAddressField = useCallback(
    (field: Path<T>, value: PathValue<T, Path<T>>) => {
      setValue(field, value);
    },
    [setValue],
  );

  const clearDistrictAndWard = useCallback(() => {
    setAddressField(districtField, null as PathValue<T, Path<T>>);
    setAddressField(wardField, null as PathValue<T, Path<T>>);
  }, [districtField, setAddressField, wardField]);

  const clearWard = useCallback(() => {
    setAddressField(wardField, null as PathValue<T, Path<T>>);
  }, [setAddressField, wardField]);

  const labels = {
    province: t('common.province'),
    district: t('common.district'),
    ward: t('common.ward'),
  };

  const placeholders = {
    province: t('common.enterProvince'),
    district: t('common.enterDistrict'),
    ward: t('common.enterWard'),
  };

  const watchedProvince = watch(provinceField) as AddressOption | null;
  const watchedDistrict = watch(districtField) as AddressOption | null;
  const watchedWard = watch(wardField) as AddressOption | null;

  const loadWardOptions = useCallback(
    async (keyword: string) => {
      const pId = watchedProvince?.id;
      const dId = watchedDistrict?.id;
      if (version === 'current' ? !pId : !(dId && pId)) {
        return [];
      }
      try {
        const params: GetWardParams =
          version === 'current'
            ? { province_id: pId!, version, keyword }
            : { district_id: dId, province_id: pId!, version, keyword };
        const axiosLib = await import('axios');
        const api = axiosLib.default.create({ baseURL: '/api' });
        const queries = createAddressQueries(api);
        const res = await queries.getWard(params);
        return (
          (res?.data ?? []).map((item: WardItem) => ({
            ...item,
            label: item.ward_name,
            value: item.id,
          }))
        );
      } catch {
        return [];
      }
    },
    [watchedProvince?.id, watchedDistrict?.id, version],
  );

  const { provinceOptions, districtOptions, wardOptions } = useAddressSelector(
    watchedProvince,
    watchedDistrict,
    version,
  );

  // Only populate from `initialValues` while the field is still empty — once
  // the user (or a prior sync) sets a value, never overwrite their selection.
  // Fields go back to empty when the parent form calls `reset()` (e.g.
  // reopening the modal), which naturally allows a fresh sync then.
  useEffect(() => {
    if (
      !watchedProvince &&
      initialValues?.provinceId &&
      provinceOptions.length > 0
    ) {
      const found = provinceOptions.find(
        (option) => option.id === initialValues.provinceId,
      );
      if (found) {
        setAddressField(provinceField, found as PathValue<T, Path<T>>);
      }
    }
  }, [
    initialValues?.provinceId,
    provinceField,
    provinceOptions,
    setAddressField,
    watchedProvince,
  ]);

  // Guard on the parent still matching `initialValues` so that a stale
  // district/ward id from the original record never gets applied under a
  // newly-selected province/district (e.g. right after a cascade-clear).
  useEffect(() => {
    if (
      !watchedDistrict &&
      initialValues?.districtId &&
      districtOptions.length > 0 &&
      watchedProvince?.id === initialValues?.provinceId
    ) {
      const found = districtOptions.find(
        (option) => option.id === initialValues.districtId,
      );
      if (found) {
        setAddressField(districtField, found as PathValue<T, Path<T>>);
      }
    }
  }, [
    districtField,
    districtOptions,
    initialValues?.districtId,
    initialValues?.provinceId,
    setAddressField,
    watchedDistrict,
    watchedProvince?.id,
  ]);

  // Ward's cascading parent is the district in legacy mode, but the province
  // directly in "current" mode (no district level in between).
  const wardParentMatchesInitial =
    version === 'current'
      ? watchedProvince?.id === initialValues?.provinceId
      : watchedDistrict?.id === initialValues?.districtId;

  useEffect(() => {
    if (
      !watchedWard &&
      initialValues?.wardId &&
      wardOptions.length > 0 &&
      wardParentMatchesInitial
    ) {
      const found = wardOptions.find(
        (option) => option.id === initialValues.wardId,
      );
      if (found) {
        setAddressField(wardField, found as PathValue<T, Path<T>>);
      }
    }
  }, [
    initialValues?.wardId,
    setAddressField,
    wardField,
    wardOptions,
    wardParentMatchesInitial,
    watchedWard,
  ]);

  const getErrorMsg = (fieldName: string) => {
    const msg = errors?.[fieldName]?.message as string | undefined;
    return msg ? t(`common.${msg}`, msg) : '';
  };

  const renderField = (
    name: string,
    label: string,
    placeholder: string,
    options: AddressOption[],
    isDisabled: boolean,
    onChangeOverride?: (
      _option: AddressOption | null,
      _defaultOnChange: (_value: AddressOption | null) => void,
    ) => void,
    loadOptions?: (keyword: string) => Promise<AddressOption[]>,
  ) => {
    const errorMsg = getErrorMsg(name);

    const labelNode = (
      <Label
        className={
          layout === 'vertical'
            ? `form-label mb-0 ${labelTextColor ? `text-${labelTextColor}` : ''}`
            : `form-label fw-medium ${labelTextColor ? `text-${labelTextColor}` : 'text-muted'}`
        }
      >
        {label}
        {isRequired && <span className="text-danger ms-1">*</span>}
      </Label>
    );

    const inputNode = (
      <>
        <Controller
          control={control}
          name={name as Path<T>}
          render={({ field: { onChange, value } }) => {
            const commonProps = {
              placeholder,
              onChange: (option: AddressOption | null) => {
                if (onChangeOverride) {
                  onChangeOverride(option, onChange);
                } else {
                  onChange(option);
                }
              },
              value: (value as AddressOption | null) ?? null,
              isDisabled,
              styles: customSelectStyles<AddressOption>(!!errorMsg),
              noOptionsMessage: () =>
                t('common.noOptions', 'Không có lựa chọn'),
              menuPlacement: 'auto' as const,
              menuPosition: 'fixed' as const,
              menuPortalTarget: document.body,
            };

            if (loadOptions) {
              return (
                <AsyncSelect<AddressOption, false>
                  {...commonProps}
                  defaultOptions={options}
                  loadOptions={loadOptions}
                />
              );
            }

            return (
              <Select<AddressOption, false>
                {...commonProps}
                options={options}
              />
            );
          }}
        />
        <FieldErrorText message={errorMsg} />
      </>
    );

    if (layout === 'vertical') {
      return (
        <Row className="mb-3">
          <Col lg={3} className="d-flex align-items-center">
            {labelNode}
          </Col>
          <Col lg={9}>{inputNode}</Col>
        </Row>
      );
    }

    return (
      <>
        {labelNode}
        {inputNode}
      </>
    );
  };

  if (layout === 'vertical') {
    return (
      <>
        {renderField(
          `${prefix}Province`,
          labels.province,
          placeholders.province,
          provinceOptions,
          false,
          (_option, defaultOnChange) => {
            clearDistrictAndWard();
            defaultOnChange(_option);
          },
        )}
        {version !== 'current' &&
          renderField(
            `${prefix}District`,
            labels.district,
            placeholders.district,
            districtOptions,
            !watchedProvince,
            (_option, defaultOnChange) => {
              clearWard();
              defaultOnChange(_option);
            },
          )}
        {renderField(
          `${prefix}Ward`,
          labels.ward,
          placeholders.ward,
          wardOptions,
          version === 'current' ? !watchedProvince : !watchedDistrict,
          undefined,
          loadWardOptions,
        )}
      </>
    );
  }

  const colSize = version === 'current' ? 6 : 4;

  return (
    <Row className="mb-3 g-3">
      <Col lg={colSize}>
        {renderField(
          `${prefix}Province`,
          labels.province,
          placeholders.province,
          provinceOptions,
          false,
          (_option, defaultOnChange) => {
            clearDistrictAndWard();
            defaultOnChange(_option);
          },
        )}
      </Col>
      {version !== 'current' && (
        <Col lg={colSize}>
          {renderField(
            `${prefix}District`,
            labels.district,
            placeholders.district,
            districtOptions,
            !watchedProvince,
            (_option, defaultOnChange) => {
              clearWard();
              defaultOnChange(_option);
            },
          )}
        </Col>
      )}
      <Col lg={colSize}>
        {renderField(
          `${prefix}Ward`,
          labels.ward,
          placeholders.ward,
          wardOptions,
          version === 'current' ? !watchedProvince : !watchedDistrict,
          undefined,
          loadWardOptions,
        )}
      </Col>
    </Row>
  );
};
