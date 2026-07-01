export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="empty-state">
      {icon}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
