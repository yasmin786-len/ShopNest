import { StarIcon } from './Icons';
import './StarRating.css';

export default function StarRating({ rating = 0, size = 14, showValue = true }) {
  const rounded = Math.round(Number(rating) * 2) / 2;

  return (
    <span className="star-rating">
      <span className="star-rating-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} width={size} height={size} filled={n <= rounded} />
        ))}
      </span>
      {showValue && <span className="star-rating-value">{Number(rating).toFixed(1)}</span>}
    </span>
  );
}
