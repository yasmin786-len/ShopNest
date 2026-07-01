import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

export default function Pagination({ pageNumber, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const windowSize = 2;
  const start = Math.max(0, pageNumber - windowSize);
  const end = Math.min(totalPages - 1, pageNumber + windowSize);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination-btn"
        disabled={pageNumber === 0}
        onClick={() => onPageChange(pageNumber - 1)}
        aria-label="Previous page"
      >
        <ChevronLeftIcon width={16} height={16} />
      </button>

      {start > 0 && (
        <>
          <button className="pagination-btn" onClick={() => onPageChange(0)}>1</button>
          {start > 1 && <span>&hellip;</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={`pagination-btn ${p === pageNumber ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
          aria-current={p === pageNumber ? 'page' : undefined}
        >
          {p + 1}
        </button>
      ))}

      {end < totalPages - 1 && (
        <>
          {end < totalPages - 2 && <span>&hellip;</span>}
          <button className="pagination-btn" onClick={() => onPageChange(totalPages - 1)}>{totalPages}</button>
        </>
      )}

      <button
        className="pagination-btn"
        disabled={pageNumber >= totalPages - 1}
        onClick={() => onPageChange(pageNumber + 1)}
        aria-label="Next page"
      >
        <ChevronRightIcon width={16} height={16} />
      </button>
    </nav>
  );
}
