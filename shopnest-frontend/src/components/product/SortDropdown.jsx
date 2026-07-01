const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'price,asc', label: 'Price: Low to High' },
  { value: 'price,desc', label: 'Price: High to Low' },
  { value: 'rating,desc', label: 'Avg. Customer Rating' },
  { value: 'createdAt,desc', label: 'Newest First' },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <select className="form-select" value={value || ''} onChange={(e) => onChange(e.target.value)} aria-label="Sort products">
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
