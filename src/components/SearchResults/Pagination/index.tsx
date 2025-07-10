"use client";

import { CaretLeftIcon, CaretRightIcon, DotsThreeIcon } from "@phosphor-icons/react";
import styles from "./styles.module.scss";

export default function Pagination(props: {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}) {
  const {
    page,
    setPage,
    totalPages,
  } = props;

  if (totalPages < 2) return null;

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages - 2, page + 3);
  const includeStartEllipsis = start > 1;
  const includeEndEllipsis = totalPages > end + 1;

  const pageButtons = [...Array(Math.max(0, end - start))].map((_, i) => start + i);

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        onClick={() => setPage(Math.max(0, page - 1))}
        disabled={page === 1}
        aria-label="Previous page of results"
      >
        <CaretLeftIcon />
      </button>

      <button
        type="button"
        onClick={() => setPage(0)}
        aria-label={`Page 1 of results`}
        aria-current={page === 0 ? "page" : undefined}
      >
        1
      </button>

      {includeStartEllipsis && (
        <div className={styles.ellipsis}>
          <DotsThreeIcon />
        </div>
      )}

      {pageButtons.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => setPage(p)}
          aria-label={`Page ${p + 1} of results`}
          aria-current={p === page ? "page" : undefined}
        >
          {(p + 1).toLocaleString()}
        </button>
      ))}

      {includeEndEllipsis && (
        <div className={styles.ellipsis}>
          <DotsThreeIcon />
        </div>
      )}

      <button
        type="button"
        onClick={() => setPage(totalPages - 1)}
        aria-label={`Page ${totalPages - 1} of results`}
        aria-current={page === totalPages - 1 ? "page" : undefined}
      >
        {totalPages.toLocaleString()}
      </button>

      <button
        type="button"
        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
        disabled={page === (totalPages - 1)}
        aria-label="Next page of results"
      >
        <CaretRightIcon />
      </button>
    </div>
  );
}
