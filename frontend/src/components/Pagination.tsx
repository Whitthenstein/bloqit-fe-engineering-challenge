import React from "react";
import ReactPaginate from "react-paginate";

type PaginationProps = {
    setPage: (v: number) => void;
    pageCount: number;
    currentPage: number;
};

const Pagination: React.FC<PaginationProps> = ({
    pageCount,
    setPage,
    currentPage
}) => {
    return (
        <section className="mt-4 flex justify-center">
            <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                onPageChange={({ selected }: { selected: number }) =>
                    setPage(selected + 1)
                }
                forcePage={currentPage - 1}
                containerClassName="flex space-x-2"
                pageClassName="px-3 py-1 border rounded"
                activeClassName="bg-blue-500 text-white"
                previousLabel="<"
                nextLabel=">"
                previousClassName="px-2 py-1"
                nextClassName="px-2 py-1"
            />
        </section>
    );
};

export default Pagination;
