"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PaginationControl } from "react-bootstrap-pagination-control";

const Pagination = ({ meta, className = "", between = 2 }) => {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePageChange = (page) => {
    setPage(page);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page);
    router.push(`${pathname}?${newParams?.toString()}`);
  };

  return (
    meta?.total > meta?.per_page && (
      <div className={`${className} my-5`}>
        <PaginationControl
          page={page}
          between={between}
          total={meta?.total}
          limit={meta?.per_page}
          changePage={(page) => {
            handlePageChange(page);
          }}
          ellipsis={1}
        />
      </div>
    )
  );
};

export default Pagination;
