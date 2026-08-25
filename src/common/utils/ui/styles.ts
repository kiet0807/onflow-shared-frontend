import type { GroupBase, StylesConfig } from 'react-select';

type SelectStyles<Option> = StylesConfig<Option, false, GroupBase<Option>>;

export const customSelectStyles = <Option,>(
  isError: boolean,
): SelectStyles<Option> => ({
  control: (provided, state) => ({
    ...provided,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    borderRadius: '8px',
    backgroundColor: state.isDisabled
      ? 'var(--vz-input-disabled-bg, #eff2f7)'
      : 'var(--vz-input-bg, #fff)',
    cursor: state.isDisabled ? 'not-allowed' : 'default',
    borderColor: state.isFocused
      ? isError
        ? '#f06548'
        : '#cfcfcf'
      : isError
        ? '#f06548'
        : '#cfcfcf',
    boxShadow: state.isFocused
      ? isError
        ? '0 0 0 3px rgba(240, 101, 72, 0.2)'
        : '0 0 0 3px rgba(64, 81, 137, 0.08)'
      : 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      borderColor: state.isFocused
        ? isError
          ? '#f06548'
          : '#cfcfcf'
        : isError
          ? '#f06548'
          : '#cfcfcf',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? 'var(--vz-gray-500, #878a99)' : 'inherit',
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? 'var(--vz-gray-400, #adb5bd)' : '#878a99',
  }),
});

export const customSmallSelectStyles = <Option,>(
  isError: boolean,
): SelectStyles<Option> => {
  const baseStyles = customSelectStyles<Option>(isError);
  return {
    ...baseStyles,
    control: (provided, state) => ({
      ...(baseStyles.control?.(provided, state) ?? provided),
      minHeight: '31px',
      height: '31px',
      fontSize: '13px',
    }),
    menu: (provided, state) => ({
      ...(baseStyles.menu?.(provided, state) ?? provided),
      fontSize: '13px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 8px',
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '31px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '2px 8px',
    }),
  };
};
