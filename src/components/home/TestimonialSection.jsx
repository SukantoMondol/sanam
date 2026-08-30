"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ImageComponent from "../UI/Cards/ImageComponent";
import { FaQuoteLeft, FaQuoteRight, FaRegStar, FaStar } from "react-icons/fa";

const TestimonialSection = ({ testimonial }) => {
  if (!testimonial || !Array.isArray(testimonial) || testimonial.length === 0) {
    return null;
  }

  return (
    <div className="container d-flex justify-content-center testimonial-section my-4">
      <div className="col-xl-8 col-12">
        <Swiper
          spaceBetween={30}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation={true}
          modules={[Navigation, Autoplay]}
          className="mySwiper"
        >
          {testimonial?.map((review) => (
            <SwiperSlide key={review?.id} className="p-md-5 p-4">
              <div className="d-flex align-items-center justify-content-center flex-wrap flex-md-nowrap gap-5 w-100 testimonial-card">
                <ImageComponent
                  src={review?.photo}
                  height={200}
                  width={200}
                  alt={review?.user_name}
                  className="img-square position-static"
                />
                <div className="testimonial-content w-100">
                  <FaQuoteLeft className="quote-icon mb-3 d-none d-md-block" />
                  <p className="name fw-medium">{review?.user_name}</p>
                  <p className="date mt-1">{review?.created_at}</p>
                  <div className="d-flex gap-4 mt-3">
                    <p className="star d-flex align-items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) =>
                        i < Math.ceil(review?.review_star || 0) ? (
                          <FaStar key={i} className="star-filled" />
                        ) : (
                          <FaRegStar key={i} className="start-empty" />
                        )
                      )}
                    </p>
                  </div>
                  <p className="review mt-3 mb-3">{review?.review}</p>

                  <div className="d-flex align-items-center gap-3 w-100">
                    <hr className="w-100" />
                    <FaQuoteRight className="quote-icon d-none d-md-block" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TestimonialSection;
