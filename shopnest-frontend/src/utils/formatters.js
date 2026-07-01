export function formatCurrency(amount) {
  const value = Number(amount ?? 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function truncateText(text, maxLength = 80) {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}

export function getOrderStatusVariant(status) {
  switch (status) {
    case 'DELIVERED':
      return 'success';
    case 'CANCELLED':
    case 'RETURNED':
      return 'danger';
    case 'PENDING':
      return 'warning';
    default:
      return 'indigo';
  }
}

export function getStockLabel(stock) {
  if (stock <= 0) return { label: 'Out of Stock', variant: 'danger' };
  if (stock <= 10) return { label: `Only ${stock} left`, variant: 'warning' };
  return { label: 'In Stock', variant: 'success' };
}
