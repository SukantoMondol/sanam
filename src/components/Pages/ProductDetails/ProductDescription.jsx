"use client";

import ReviewCard from "@/components/UI/Cards/ReviewCard";
import { StarRating } from "@/components/util/StarRating";
import { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const ProductDescription = ({
  productDetailsData,
  activeTab,
  setActiveTab,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const reviewCounts = {
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0,
  };

  (productDetailsData?.product?.product_reviews || []).forEach((review) => {
    if (review.review_star === 5) {
      reviewCounts.fiveStar += 1;
    } else if (review.review_star === 4) {
      reviewCounts.fourStar += 1;
    } else if (review.review_star === 3) {
      reviewCounts.threeStar += 1;
    } else if (review.review_star === 2) {
      reviewCounts.twoStar += 1;
    } else if (review.review_star === 1) {
      reviewCounts.oneStar += 1;
    }
  });

  return (
    <div className="container p-0 productDescriptionSection">
      {/* Navigation Tabs */}
      <ul className="nav nav-tabs border-0">
        <li className="nav-item">
          <button
            className={`nav-link rounded-0 py-3 px-5 w-100 ${activeTab === "description" ? "active" : ""
              }`}
            style={{
              backgroundColor:
                activeTab === "description" ? "#772D92" : "#f8f8f8",
              color: activeTab === "description" ? "white" : "black",
              border: "none",
            }}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-0 py-3 px-5 w-100 ${activeTab === "specification" ? "active" : ""
              }`}
            style={{
              backgroundColor:
                activeTab === "specification" ? "#772D92" : "#f8f8f8",
              color: activeTab === "specification" ? "white" : "black",
              border: "none",
            }}
            onClick={() => setActiveTab("specification")}
          >
            Product Specification
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-0 py-3 px-5 w-100 ${activeTab === "delivery" ? "active" : ""
              }`}
            style={{
              backgroundColor: activeTab === "delivery" ? "#772D92" : "#f8f8f8",
              color: activeTab === "delivery" ? "white" : "black",
              border: "none",
            }}
            onClick={() => setActiveTab("delivery")}
          >
            Delivery & Return Policy
          </button>
        </li>
        <li className="nav-item">
          <button
            id="product-reviews"
            className={`nav-link rounded-0 py-3 px-5 w-100 ${activeTab === "review" ? "active" : ""
              }`}
            style={{
              backgroundColor: activeTab === "review" ? "#772D92" : "#f8f8f8",
              color: activeTab === "review" ? "white" : "black",
              border: "none",
            }}
            onClick={() => setActiveTab("review")}
          >
            Review
          </button>
        </li>
      </ul>

      {/* Content */}
      <div className="tab-content">
        {activeTab === "description" && (
          <div
            className="description"
            dangerouslySetInnerHTML={
              productDetailsData?.product?.description
                ? { __html: productDetailsData?.product?.description }
                : { __html: "" }
            }
          />
        )}

        {activeTab === "specification" && (
          <div>
            <table className={"table table-bordered table-striped table-hover"}>
              <tbody>
                {productDetailsData?.product?.product_specifications?.map(
                  (item) => (
                    <tr key={item.id}>
                      <td>{item.specification_name}</td>
                      <td>{item.value}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "delivery" && (
          <div
            className="deliveryAndRetrunPolicy"
            dangerouslySetInnerHTML={
              productDetailsData?.delivery_and_return_policy
                ? { __html: productDetailsData.delivery_and_return_policy }
                : { __html: "" }
            }
          />
        )}

        {activeTab === "review" && (
          <div className="productReviews">
            <div className="reviewSummary">
              <h6>Ratings & Reviews</h6>

              <div className="d-flex gap-4">
                <div className="border-end pe-4">
                  <p className="mb-0">
                    {
                      productDetailsData?.product?.calculated_review
                        ?.average_review
                    }
                    /5
                  </p>

                  <div className="d-flex justify-content-center my-1">
                    <StarRating
                      showReviews={false}
                      rating={
                        productDetailsData?.product?.calculated_review
                          ?.average_review
                      }
                    />
                  </div>

                  <p className="text-nowrap">
                    {Math.round(
                      (productDetailsData?.product?.calculated_review
                        ?.average_review /
                        5) *
                      100
                    )}
                    % Rating
                  </p>
                </div>

                <div className="w-100 d-flex flex-column gap-1">
                  <div className="d-flex align-items-center gap-4 w-100">
                    <StarRating showReviews={false} rating={5} />
                    <div
                      className="progress w-100"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar bg-purple"
                        style={{
                          width: `${(reviewCounts?.fiveStar /
                            productDetailsData?.product?.product_reviews
                              ?.length) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="fw-medium">{reviewCounts?.fiveStar}</span>
                  </div>

                  <div className="d-flex align-items-center gap-4 w-100">
                    <StarRating showReviews={false} rating={4} />
                    <div
                      className="progress w-100"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar bg-purple"
                        style={{
                          width: `${(reviewCounts?.fourStar /
                            productDetailsData?.product?.product_reviews
                              ?.length) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="fw-medium">{reviewCounts?.fourStar}</span>
                  </div>

                  <div className="d-flex align-items-center gap-4 w-100">
                    <StarRating showReviews={false} rating={3} />
                    <div
                      className="progress w-100"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar bg-purple"
                        style={{
                          width: `${(reviewCounts?.threeStar /
                            productDetailsData?.product?.product_reviews
                              ?.length) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="fw-medium">{reviewCounts?.threeStar}</span>
                  </div>

                  <div className="d-flex align-items-center gap-4 w-100">
                    <StarRating showReviews={false} rating={2} />
                    <div
                      className="progress w-100"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar bg-purple"
                        style={{
                          width: `${(reviewCounts?.twoStar /
                            productDetailsData?.product?.product_reviews
                              ?.length) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="fw-medium">{reviewCounts?.twoStar}</span>
                  </div>

                  <div className="d-flex align-items-center gap-4 w-100">
                    <StarRating showReviews={false} rating={1} />
                    <div
                      className="progress w-100"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar bg-purple"
                        style={{
                          width: `${(reviewCounts?.oneStar /
                            productDetailsData?.product?.product_reviews
                              ?.length) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="fw-medium">{reviewCounts?.oneStar}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column gap-4 my-4">
              {productDetailsData?.product?.product_reviews
                ?.slice(
                  0,
                  isExpanded
                    ? productDetailsData?.product?.product_reviews?.length
                    : 5
                )
                .map((review) => (
                  <ReviewCard key={review?.id} review={review} />
                ))}
              {productDetailsData?.product?.product_reviews?.length > 5 && (
                <div className="buttonsContainer">
                  <button onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? "View All" : "View Less"} <FaArrowRightLong />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
