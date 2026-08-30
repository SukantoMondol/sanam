"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import RewardsGrid from "@/components/home/RewardsGrid";
import BottomBanner from "./BottomBanner";
import ProductBlockWrapper from "@/components/home/ProductBlockWrapper";
import TestimonialSection from "./TestimonialSection";
import HeroBannerWrapper from "./HeroBannerWrapper";

const LIVE_BACKEND = "https://kw.sanamstore.net";

function formatImageUrl(path) {
  if (!path) return "/assets/images/logo.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${LIVE_BACKEND}/${path.replace(/^\//, "")}`;
}

function mapLiveHomeResponse(raw) {
  const data = raw?.data || raw || {};

  // 1. Map slideshow banners
  const banners = (data?.slideshow || []).map((slide, idx) => ({
    id: slide?.id || idx + 1,
    title: "Hero Banner",
    link: slide?.link || "/",
    url: slide?.link || "/",
    image: formatImageUrl(slide?.image),
    picture: formatImageUrl(slide?.image),
    mobile_image: formatImageUrl(slide?.image),
    mobile_picture: formatImageUrl(slide?.image),
    button_text: "Shop Now",
  }));

  // 2. Map sections to product blocks
  const block_categories = (data?.sections || []).map((section) => {
    const products = (section?.items || []).map((item, pIdx) => {
      const retailPrice = Number(item?.retail_price) || 0;
      const oldPrice = Number(item?.old_price) || 0;
      const price = oldPrice > retailPrice ? oldPrice : retailPrice;
      const discount = oldPrice > retailPrice ? oldPrice - retailPrice : 0;

      return {
        id: item?.id || pIdx + 1,
        name: item?.title || "Product",
        title: item?.title || "Product",
        slug: String(item?.id || pIdx + 1),
        photo: formatImageUrl(item?.image),
        image: formatImageUrl(item?.image),
        photo_alt: item?.title || "Product Image",
        price: {
          price: price,
          payable_price: retailPrice,
          discount: discount,
          discount_percentage: price > 0 ? Math.round((discount / price) * 100) : 0,
        },
        rating: 4.8,
        review: {
          average_rating: 4.8,
          total_review: 15,
        },
        stock_status: item?.is_stock > 0 ? "in_stock" : "out_of_stock",
        product_inventory: {
          stock: item?.is_stock || 10,
        },
      };
    });

    return {
      id: section?.id,
      name: section?.title || "Category",
      slug: String(section?.id),
      product_block_show: true,
      category_banner: null,
      category_mobile_banner: null,
      category_products: products,
    };
  });

  // 3. Bottom banner
  const bottom_banner = data?.banner?.[0]
    ? {
        id: data.banner[0].id,
        image: formatImageUrl(data.banner[0].image),
        link: data.banner[0].link || "/",
        title: "Promotional Banner",
      }
    : null;

  return {
    banners,
    top_categories: [],
    block_categories,
    bottom_banner,
    testimonial: [],
    offertext: data?.offertext || "Same day delivery service if you order before 10 pm",
  };
}

const HomeComponent = ({ data: initialData }) => {
  const [homeData, setHomeData] = useState(initialData || {});

  useEffect(() => {
    // If initialData doesn't have products, fetch directly from user browser!
    if (!initialData?.block_categories || initialData.block_categories.length === 0) {
      axios
        .post(`${LIVE_BACKEND}/api/iosv1/getHome`)
        .then((res) => {
          if (res?.data) {
            const mapped = mapLiveHomeResponse(res.data);
            if (mapped.block_categories.length > 0) {
              setHomeData(mapped);
            }
          }
        })
        .catch((err) => {
          console.error("Client getHome error:", err);
        });
    }
  }, [initialData]);

  const displayData = homeData?.block_categories?.length > 0 ? homeData : initialData;

  return (
    <>
      {displayData && (
        <>
          {/* Banner - only shows if banners exist from backend */}
          {displayData?.banners?.length > 0 && (
            <HeroBannerWrapper banners={displayData?.banners} />
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

          {/* EXPLORE YOUR INTERESTS - First product block */}
          {displayData?.block_categories?.length > 0 && (
            <div className="container mt-4">
              <h2 className="temu-explore-title">EXPLORE YOUR INTERESTS</h2>
            </div>
          )}

          {/* Product Blocks - Temu 5-column grid */}
          <ProductBlockWrapper block_categories={displayData?.block_categories} />

          {/* Bottom Banner - if exists */}
          {displayData?.bottom_banner && (
            <BottomBanner bottom_banner={displayData?.bottom_banner} />
          )}

          {/* Testimonials */}
          {displayData?.testimonial?.length > 0 && (
            <TestimonialSection testimonial={displayData?.testimonial} />
          )}

          {/* Benefits Grid */}
          <RewardsGrid />
        </>
      )}
    </>
  );
};

export default HomeComponent;