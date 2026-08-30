export function StarRating({ rating, reviews, showReviews = true }) {
  return (
    <div className="d-flex align-items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="star"
          style={{ color: star <= rating ? "var(--primary-color)" : "#e4e5e9" }}
        >
          ★
        </span>
      ))}

      {showReviews && <span className="reviews ms-2">({reviews})</span>}
    </div>
  );
}
