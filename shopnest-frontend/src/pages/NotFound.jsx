import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found-code">404</span>
      <h1>This page wandered off the shelf</h1>
      <p>We couldn&apos;t find the page you were looking for. It may have been moved or no longer exists.</p>
      <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
    </div>
  );
}
