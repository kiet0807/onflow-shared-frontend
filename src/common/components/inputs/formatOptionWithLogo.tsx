import type { ReactNode } from 'react';

import { ImageFallback } from '../displays/ImageFallback';
import { EMPTY_VALUE } from '../../constants';

interface OptionData {
  label?: string;
  logo?: string;
  [key: string]: unknown;
}

interface SelectContext {
  context?: 'value' | 'menu';
}

/** Custom formatter for react-select options with a round logo and label. */
export const formatOptionWithLogo = (
  data: OptionData,
  context: SelectContext,
): ReactNode => {
  const isValueContext = context?.context === 'value';
  const content = (
    <div className="d-flex align-items-center gap-2">
      {data?.logo && (
        <ImageFallback
          src={data.logo}
          className="rounded-circle avatar-xxs user-profile-image"
          alt=""
        />
      )}
      <p className="mb-0 text-truncate">{data?.label || EMPTY_VALUE}</p>
    </div>
  );

  return isValueContext ? (
    <div className="overflow-hidden">{content}</div>
  ) : (
    content
  );
};
