import { render, screen } from '@testing-library/react';

import { FinanceConfigTable } from '../index';
import { TestI18nProvider } from '../../../../../common/utils/__tests__/i18n';

import { makeFinanceConfig, makeStore } from './factories';

const renderTable = (ui: React.ReactNode) =>
  render(<TestI18nProvider>{ui}</TestI18nProvider>);

describe('<FinanceConfigTable />', () => {
  it('renders all configured column headers', () => {
    renderTable(<FinanceConfigTable data={[makeFinanceConfig()]} />);

    // Headers come from `eInvoice.table.*` translations; with no bundle they
    // resolve to the key itself.
    expect(screen.getByText('table.invoiceChannel')).toBeInTheDocument();
    expect(screen.getByText('table.stores')).toBeInTheDocument();
    expect(screen.getByText('table.status')).toBeInTheDocument();
    expect(screen.getByText('table.channelCreatedAt')).toBeInTheDocument();
    expect(screen.getByText('table.channelUpdatedAt')).toBeInTheDocument();
    expect(screen.getByText('table.actions')).toBeInTheDocument();
  });

  it('renders one row per finance config', () => {
    renderTable(
      <FinanceConfigTable
        data={[
          makeFinanceConfig({ id: 1 }),
          makeFinanceConfig({ id: 2, invoiceChannel: 'VNPT' }),
        ]}
      />
    );

    // Invoice channel names rendered in first column
    expect(screen.getAllByText('SInvoice')).toHaveLength(1);
    expect(screen.getByText('VNPT')).toBeInTheDocument();
  });

  it('renders a fallback message when data is empty', () => {
    renderTable(<FinanceConfigTable data={[]} />);

    // emptyComponent renders the localized "common.noData" key.
    expect(screen.getByText('common.noData')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    const { container } = renderTable(
      <FinanceConfigTable data={[]} isLoading />
    );
    // PaginateTable renders a spinner via reactstrap which has the `spinner` class.
    expect(container.querySelector('.spinner-border, .spinner')).toBeTruthy();
  });

  it('shows error state when isError is true', () => {
    renderTable(<FinanceConfigTable data={[]} isError />);

    // <Error /> renders an <h5> with the localized key 'common.error' fallback.
    expect(screen.getByText('common.error')).toBeInTheDocument();
  });

  it('exposes store rows when config has stores', () => {
    renderTable(
      <FinanceConfigTable
        data={[
          makeFinanceConfig({
            stores: [
              makeStore({ id: 11, name: 'Store A' }),
              makeStore({ id: 12, name: 'Store B' }),
            ],
          }),
        ]}
      />
    );

    expect(screen.getByText('Store A')).toBeInTheDocument();
    expect(screen.getByText('Store B')).toBeInTheDocument();
  });
});
