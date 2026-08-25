import { Table } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { PaginateTable } from '../../../../common/components/tables';
import type { FinanceConfig } from './types';
import { StatusCell } from './StatusCell';
import { ActionCell } from './ActionCell';
import { StoreCell } from './StoreCell';

export interface FinanceConfigTableProps {
  data: FinanceConfig[];
  onEdit?: (item: FinanceConfig) => void;
  onDelete?: (item: FinanceConfig) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  currentPage?: number;
  totalPage?: number;
  onPaginate?: (_page: number) => void;
}

export const FinanceConfigTable = ({
  data,
  onEdit,
  onDelete,
  isLoading,
  isFetching = false,
  isError,
  currentPage,
  totalPage = 1,
  onPaginate,
}: FinanceConfigTableProps) => {
  const { t } = useTranslation();

  return (
    <PaginateTable
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      listData={data}
      currentPage={currentPage}
      totalPage={totalPage}
      onPaginate={onPaginate}
      className="table-responsive rounded-3 overflow-hidden border shadow-sm"
    >
      <Table className="table-nowrap align-middle mb-0">
        <thead className="table-light text-muted">
          <tr>
            <th>{t('common.table.invoiceChannel')} 123</th>
            <th>{t('common.table.stores')}</th>
            <th>{t('common.table.status')}</th>
            <th>{t('common.table.channelCreatedAt')}</th>
            <th>{t('common.table.channelUpdatedAt')}</th>
            <th>{t('common.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-sm">{item.invoiceChannel}</td>
              <td className="px-4 py-3 text-sm">
                <StoreCell stores={item.stores} />
              </td>
              <td className="px-4 py-3 text-sm">
                <StatusCell status={item.status} />
              </td>
              <td className="px-4 py-3 text-sm">{item.channelCreatedAt}</td>
              <td className="px-4 py-3 text-sm">{item.channelUpdatedAt}</td>
              <td className="px-4 py-3 text-end">
                <ActionCell item={item} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PaginateTable>
  );
};
