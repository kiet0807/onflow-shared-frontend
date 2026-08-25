import { useState } from 'react';
import type {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Label } from 'reactstrap';

import { useToggle } from '../../../common/hooks';

import { SwitchButton } from '../buttons';
import { ConfirmModal } from '../modals';

// TODO: flip to `true` once the merged province+ward (`current`) address
// system is live on the backend, then remove this flag and the `disabled`/
// `title` wiring below.
const IS_NEW_ADDRESS_VERSION_READY = false;

/**
 * Infers whether a persisted address was saved with the merged province+ward
 * (`current`) administrative system rather than the legacy province+district+ward
 * one. The `current` system has no district level, so a ward saved without a
 * district can only have come from it — the legacy `AddressSelectGroup` never
 * lets a user pick a ward before a district.
 *
 * Use this on edit/load flows to derive the initial `useNewAddress` value
 * instead of hardcoding `false`.
 */
export const isNewAddressVersion = (
  districtId?: string | number | null,
  wardId?: string | number | null,
): boolean => !districtId && !!wardId;

export interface AddressVersionSwitchProps<
  T extends FieldValues = FieldValues,
> {
  control: Control<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  /** Field storing the toggle value. Defaults to `'useNewAddress'`. */
  name?: Path<T>;
  /** Shared with the sibling `AddressSelectGroup`'s `prefix`, used to locate and clear Province/District/Ward when the version changes. */
  prefix?: string;
  id?: string;
  label?: string;
}

/**
 * AddressVersionSwitch — toggles an `AddressSelectGroup` between the `legacy`
 * (province/district/ward) and `current` (merged province/ward) administrative
 * address systems. Since switching versions invalidates the currently
 * selected Province/District/Ward (they come from different option sets),
 * it confirms with the user before clearing them.
 *
 * Usage: pass the same `prefix` given to the sibling `AddressSelectGroup`.
 */
export const AddressVersionSwitch = <T extends FieldValues>({
  control,
  watch,
  setValue,
  name = 'useNewAddress' as Path<T>,
  prefix = 'business',
  id = 'switchNewAddress',
  label,
}: AddressVersionSwitchProps<T>) => {
  const { t } = useTranslation('common');

  const provinceField = `${prefix}Province` as Path<T>;
  const districtField = `${prefix}District` as Path<T>;
  const wardField = `${prefix}Ward` as Path<T>;

  const hasExistingAddress = Boolean(
    watch(provinceField) || watch(districtField) || watch(wardField),
  );

  const {
    isOpen: isConfirmModalOpen,
    onOpen: openConfirmModal,
    onClose: closeConfirmModal,
  } = useToggle(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <div
            className="d-flex align-items-center gap-2"
            title={
              IS_NEW_ADDRESS_VERSION_READY ? undefined : t('common.comingSoon')
            }
          >
            <Label
              className={`mb-0 fs-13 fw-medium text-secondary ${
                IS_NEW_ADDRESS_VERSION_READY ? '' : 'opacity-50'
              }`}
              htmlFor={id}
            >
              {label || t('common.newAddressToggle')}
            </Label>
            <SwitchButton
              id={id}
              color="secondary"
              size="sm"
              checked={Boolean(value)}
              disabled={!IS_NEW_ADDRESS_VERSION_READY}
              className="mb-0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const nextValue = e.target.checked;
                if (hasExistingAddress) {
                  setPendingValue(nextValue);
                  openConfirmModal();
                } else {
                  onChange(nextValue);
                }
              }}
            />
          </div>
        )}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        headerTitle={t('common.confirmChange')}
        title={t('common.confirmClearAddressMsg')}
        doAction={() => {
          if (pendingValue !== null) {
            setValue(name, pendingValue as PathValue<T, Path<T>>);
          }
          setValue(provinceField, null as PathValue<T, Path<T>>);
          setValue(districtField, null as PathValue<T, Path<T>>);
          setValue(wardField, null as PathValue<T, Path<T>>);
          closeConfirmModal();
          setPendingValue(null);
        }}
        onClose={() => {
          closeConfirmModal();
          setPendingValue(null);
        }}
      />
    </>
  );
};
