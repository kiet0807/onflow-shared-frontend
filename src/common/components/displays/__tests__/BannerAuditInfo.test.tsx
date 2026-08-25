import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BannerAuditInfo } from '../BannerAuditInfo';

describe('BannerAuditInfo', () => {
  it('renders creator and updater emails', () => {
    render(
      <BannerAuditInfo
        creator={{ id: '1', email: 'creator@example.com' }}
        updater={{ id: '2', email: 'updater@example.com' }}
        creatorLabel="Người tạo"
        updaterLabel="Người cập nhật"
      />,
    );

    expect(screen.getByText('creator@example.com')).toBeTruthy();
    expect(screen.getByText('updater@example.com')).toBeTruthy();
  });

  it('falls back to --- when audit users are missing', () => {
    render(
      <BannerAuditInfo
        creator={null}
        updater={undefined}
        creatorLabel="Người tạo"
        updaterLabel="Người cập nhật"
      />,
    );

    expect(screen.getAllByText('---')).toHaveLength(2);
  });
});
