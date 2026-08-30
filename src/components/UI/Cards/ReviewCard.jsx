import ImageComponent from "./ImageComponent";

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card d-flex">
      <div className="d-flex flex-wrap flex-xl-nowrap align-items-center gap-4">
        <ImageComponent
          height={70}
          width={70}
          src={review?.photo}
          alt={review?.user_name}
          className="rounded-circle border"
        />

        <div className="review-content">
          <p className="review-user fw-semibold text-purple">
            {review?.user_name}
          </p>

          <div className="mt-2">
            <p className="review-date">Posted on {review?.created_at}</p>
            <p className="review-text">{review?.review}</p>
          </div>
        </div>
      </div>

      <div className="text-purple">
        <span className="me-1 text-black">
          ({review?.review_star?.toFixed(1)})
        </span>
        {"★".repeat(parseFloat(review?.review_star) ?? 0)}
      </div>
    </div>
  );
};

export default ReviewCard;
