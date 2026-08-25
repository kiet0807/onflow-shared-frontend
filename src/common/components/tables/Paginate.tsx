import { memo } from 'react';
import ReactPaginate from 'react-paginate';
import { PaginationLink } from 'reactstrap';

interface PaginateProps {
  onPaginate: (page: number) => void;
  totalPage: number;
  currentPage: number;
}

const PaginateInner = ({
  onPaginate,
  totalPage,
  currentPage,
}: PaginateProps) => {
  return (
    <div className="d-flex justify-content-end align-items-center">
      <ReactPaginate
        breakLabel={<PaginationLink to="#">...</PaginationLink>}
        breakClassName="page-item"
        activeClassName="active"
        onPageChange={({ selected }) => onPaginate(selected + 1)}
        pageRangeDisplayed={2}
        pageCount={totalPage}
        renderOnZeroPageCount={null}
        nextLabel={
          <PaginationLink
            to="#"
            className="rounded bg-white paginate-icon-spacing"
          >
            →
          </PaginationLink>
        }
        previousLabel={
          <PaginationLink to="#" className="rounded bg-white">
            ←
          </PaginationLink>
        }
        className="pagination pagination-md pagination-separated mb-0"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        forcePage={currentPage - 1}
      />
    </div>
  );
};

export const Paginate = memo(PaginateInner);
