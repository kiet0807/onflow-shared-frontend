/**
 * Extract initials from a name string.
 *
 * Takes the first letter of each word and returns up to 2 characters,
 * uppercased. Falls back to the provided default when name is falsy.
 *
 * @example getInitials('Nguyen Van A')  // 'NV'
 * @example getInitials('Admin')         // 'A'
 * @example getInitials('')              // '?'
 *
 * @param {string} name - Full name string
 * @param {string} fallback - Fallback character(s) when name is empty
 * @returns {string}
 */
export const getInitials = (
  name: string | null | undefined,
  fallback: string = '?',
): string => {
  if (!name) return fallback;
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

/**
 * Generate a random 7-character alphanumeric string.
 *
 * @returns {string}
 */
export const generateId = (): string =>
  Math.random().toString(36).substring(2, 9);
