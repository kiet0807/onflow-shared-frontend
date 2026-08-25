import { Fragment } from 'react';
import { Col, Container, Row, Spinner } from 'reactstrap';

import { Paginate } from './Paginate';
import { Empty, Error } from '../displays';

/**
 * PaginateTable — Table wrapper with loading/error/empty states
 * and integrated pagination.
 */
export interface PaginateTableProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  isFetching?: boolean;
  listData?: unknown[];
  isError?: boolean;
  totalPage?: number;
  onPaginate?: (_page: number) => void;
  currentPage?: number;
  skeleton?: {
    skeletonLength?: number;
    skeletonElement?: React.ReactNode;
  };
  className?: string;
  classNamePaginate?: string;
  emptyComponent?: React.ReactNode;
  hiddenPaginate?: boolean;
}

export const PaginateTable = ({
  children,
  isLoading,
  isFetching = false,
  listData = [],
  isError,
  totalPage = 1,
  onPaginate,
  currentPage,
  skeleton,
  className = 'table-responsive',
  classNamePaginate = 'mt-4',
  emptyComponent,
  hiddenPaginate,
}: PaginateTableProps) => {
  const bodyClassName = `${className} paginate-table-body ${
    isFetching && !isLoading ? 'table-loading' : ''
  }`.trim();

  const hasData = listData?.length > 0;
  const isEmpty = !hasData && !isError && !isLoading;
  const shouldShowPagination =
    !hiddenPaginate && onPaginate && hasData && totalPage > 1;

  return (
    <>
      <div className="position-relative">
        {isFetching && !isLoading && (
          <div className="table-loading-overlay">
            <Spinner color="secondary" className="table-loading-spinner" />
          </div>
        )}
        <div className={bodyClassName}>
          {children}
          {isLoading ? (
            skeleton ? (
              Array.from(
                { length: skeleton?.skeletonLength || 0 },
                (_, index) => (
                  <Fragment key={index}>{skeleton?.skeletonElement}</Fragment>
                ),
              )
            ) : (
              <div className="py-5">
                <Container fluid>
                  <Row className="justify-content-center">
                    <Col xl={12} className="text-center">
                      <Spinner color="secondary" />
                    </Col>
                  </Row>
                </Container>
              </div>
            )
          ) : (
            isEmpty && (
              <div className="py-4 my-3">{emptyComponent || <Empty />}</div>
            )
          )}
          {isError && (
            <div className="py-4">
              <Error />
            </div>
          )}
        </div>
      </div>
      {shouldShowPagination && (
        <div className={classNamePaginate}>
          <Paginate
            totalPage={totalPage}
            onPaginate={onPaginate}
            currentPage={currentPage ?? 1}
          />
        </div>
      )}
    </>
  );
};
