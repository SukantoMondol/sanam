import TopCategories from "@/components/home/TopCategories";
import RewardsGrid from "@/components/home/RewardsGrid";
import BottomBanner from "./BottomBanner";
import ProductBlockWrapper from "@/components/home/ProductBlockWrapper";
import TestimonialSection from "./TestimonialSection";
import HeroBannerWrapper from "./HeroBannerWrapper";

const HomeComponent = async ({ data }) => {
  return (
    <>
      {data && (
        <>
          {/* Banner - only shows if banners exist from backend */}
          {data?.banners?.length > 0 && (
            <HeroBannerWrapper banners={data?.banners} />
          )}

          {/* Hidden SEO heading */}
          <div className="d-none heading-container text-center mt-5">
            <h1>Online Shopping in Kuwait - Sanam Store</h1>
            <p>
              Shop quality products at{" "}
              {process.env.NEXT_PUBLIC_SITE_NAME}. Fast delivery, best prices,
              and amazing deals in Kuwait.
            </p>
          </div>

          {/* Top Categories - Temu circular style (Commented out as requested) */}
          {/* <TopCategories top_categories={data?.top_categories} /> */}

          {/* EXPLORE YOUR INTERESTS - First product block */}
          {data?.block_categories?.length > 0 && (
            <div className="container mt-4">
              <h2 className="temu-explore-title">EXPLORE YOUR INTERESTS</h2>
            </div>
          )}

          {/* Product Blocks - Temu 5-column grid */}
          <ProductBlockWrapper block_categories={data?.block_categories} />

          {/* Bottom Banner - if exists */}
          {data?.bottom_banner && (
            <BottomBanner bottom_banner={data?.bottom_banner} />
          )}

          {/* Testimonials */}
          {data?.testimonial?.length > 0 && (
            <TestimonialSection testimonial={data?.testimonial} />
          )}

          {/* Benefits Grid */}
          <RewardsGrid />
        </>
      )}
    </>
  );
};

export default HomeComponent;