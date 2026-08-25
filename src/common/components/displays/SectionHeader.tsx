import classNames from 'classnames';

export interface SectionHeaderProps {
  icon: string;
  title: string;
  bgColor?: string;
  textColor?: string;
  rightElement?: React.ReactNode;
  borderBottom?: boolean;
}

/**
 * SectionHeader — Reusable card section header with icon box + title.
 *
 * @param {string} icon - Remix icon class name (e.g. 'ri-information-line')
 * @param {string} title - Section title text
 * @param {string} bgColor - Background color modifier (e.g. 'info', 'success', 'warning', 'primary')
 * @param {string} textColor - Text color modifier (e.g. 'secondary', 'dark', 'info')
 * @param {React.ReactNode} rightElement - Right element
 * @param {boolean} borderBottom - Whether to add bottom border
 */
export const SectionHeader = ({
  icon,
  title,
  bgColor = 'info',
  textColor = 'primary',
  rightElement,
  borderBottom = true,
}: SectionHeaderProps) => {
  const isBrand = bgColor === 'brand';

  return (
    <div
      className={classNames(
        'd-flex align-items-center justify-content-between',
        borderBottom && 'pb-3 mb-3 border-bottom',
      )}
    >
      <h6
        className={classNames(
          'd-flex align-items-center gap-2 fw-bold mb-0 fs-15',
          `text-${textColor}`,
        )}
      >
        <div
          className={classNames(
            'avatar-xs d-flex align-items-center justify-content-center rounded-2.5 shadow-sm',
            isBrand ? 'op-brand-surface' : `bg-soft-${bgColor}`,
          )}
        >
          <i
            className={classNames(
              icon,
              'fs-17',
              isBrand ? 'text-white' : `text-${bgColor}`,
            )}
          />
        </div>
        {title}
      </h6>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};
