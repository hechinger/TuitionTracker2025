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

  const start = Math.max(0, page - 1);
  const end = Math.min(totalPages - 1, start + 3);
  const showFirst = start > 0;
  const showStartEllipsis = start > 1;
  const showLast = end < (totalPages - 1);
  const showEndEllipsis = end < (totalPages - 2);

  const pageButtons = [...Array(Math.max(0, end - start + 1))].map((_, i) => start + i);

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        onClick={() => setPage(Math.max(0, page - 1))}
        disabled={page === 0}
        aria-label="Previous page of results"
      >
        <CaretLeftIcon />
      </button>

      {showFirst && (
        <button
          type="button"
          onClick={() => setPage(0)}
          aria-label={`Page 1 of results`}
          aria-current={page === 0 ? "page" : undefined}
        >
          1
        </button>
      )}

      {showStartEllipsis && (
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

      {showEndEllipsis && (
        <div className={styles.ellipsis}>
          <DotsThreeIcon />
        </div>
      )}

      {showLast && (
        <button
          type="button"
          onClick={() => setPage(totalPages - 1)}
          aria-label={`Page ${totalPages - 1} of results`}
          aria-current={page === totalPages - 1 ? "page" : undefined}
        >
          {totalPages.toLocaleString()}
        </button>
      )}

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
