import { useState } from "react";
import { useSearchParams } from "react-router";

const Pagination = ({ curPage, totalPages }) => {
  const [page, setPage] = useState(curPage);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNextPage = () => {
    searchParams.set("page", page + 1);
    setSearchParams(searchParams);
    setPage(Number(searchParams.get("page")));
  };

  const handlePrevPage = () => {
    searchParams.set("page", page - 1);
    setSearchParams(searchParams);
    setPage(Number(searchParams.get("page")));
  };

  const nextBtnDisabled = curPage === totalPages;
  const prevBtnDisabled = curPage === 1;

  return (
    <div className="join">
      <button
        disabled={prevBtnDisabled}
        onClick={handlePrevPage}
        className="join-item btn"
      >
        «
      </button>
      <button className="join-item btn">{curPage}</button>
      <button
        onClick={handleNextPage}
        disabled={nextBtnDisabled}
        className={`join-item btn`}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
