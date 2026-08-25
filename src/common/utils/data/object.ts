import { omitBy } from 'lodash';

export function changeStringToNumberObject(
  value: Record<string, unknown>,
): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      const val = value[key];
      const parsedValue = Number(val);
      // If it's empty string or whitespace, Number() might return 0.
      // But let's mirror the old lodash mapValues/toNumber logic.
      // lodash.toNumber returns NaN for non-numbers.
      newObj[key] =
        Number.isNaN(parsedValue) ||
        val === '' ||
        val === null ||
        val === undefined
          ? val
          : parsedValue;
    }
  }
  return newObj;
}

export const omitObject = (
  object: Record<string, unknown>,
): Record<string, unknown> => {
  return omitBy(
    object,
    (item) => item === null || item === undefined || item === 'undefined',
  );
};
