import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BrandedLoading } from '../BrandedLoading';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, fallback?: string) => fallback ?? _key,
  }),
}));

describe('BrandedLoading', () => {
  it('renders branded loading status', () => {
    const { container } = render(<BrandedLoading />);

    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('Đang tải...')).toBeTruthy();
    expect(container.querySelector('.route-status-page--loading')).toBeTruthy();
    expect(container.querySelector('.route-status-page--embedded')).toBeNull();
  });

  it('applies embedded variant for in-layout Suspense', () => {
    const { container } = render(<BrandedLoading embedded />);

    expect(
      container.querySelector('.route-status-page--embedded'),
    ).toBeTruthy();
  });
});
