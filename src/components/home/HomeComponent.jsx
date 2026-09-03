"use client";

import { useState, useMemo } from "react";
import RewardsGrid from "@/components/home/RewardsGrid";
import BottomBanner from "./BottomBanner";
import TestimonialSection from "./TestimonialSection";
import HeroBannerWrapper from "./HeroBannerWrapper";
import DealsSection from "./DealsSection";
import TopRatedSection from "./TopRatedSection";
import RecommendedSection from "./RecommendedSection";
import InfiniteProductFeed from "./InfiniteProductFeed";
import fallbackHomeData from "@/data/liveHomeData.json";
import { Truck, ShieldCheck, Zap, RefreshCw } from "lucide-react";

const HomeComponent = ({ data: initialData }) => {
  const [homeData] = useState(() => {
    if (initialData?.block_categories?.length > 0) return initialData;
    return fallbackHomeData;
  });

  const displayData = homeData?.block_categories?.length > 0 ? homeData : fallbackHomeData;

  // Flatten and collect all products from categories
  const allProducts = useMemo(() => {
    const products = [];
    const seen = new Set();

    (displayData?.block_categories || []).forEach((cat) => {
      (cat?.category_products || []).forEach((p) => {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          products.push(p);
        }
      });
    });

    return products;
  }, [displayData]);

  // Lightning Deals: items with significant discounts
  const lightningDeals = useMemo(() => {
    return allProducts
      .filter((p) => (p?.price?.discount_percentage || 0) >= 15 || (p?.price?.discount || 0) > 0)
      .slice(0, 12);
  }, [allProducts]);

  // Clearance Deals: items with high discount or specific deal flags
  const clearanceDeals = useMemo(() => {
    return allProducts
      .filter((p) => (p?.price?.discount_percentage || 0) >= 25)
      .slice(0, 12);
  }, [allProducts]);

  // 5-Star rated products
  const topRatedProducts = useMemo(() => {
    return allProducts
      .filter((p) => (p?.review?.average_rating || 0) >= 4.5 || (p?.rating || 0) >= 4.5)
      .slice(0, 10);
  }, [allProducts]);

  return (
    <>
      {displayData && (
        <>
          {/* 1. Hero Banners Carousel */}
          {displayData?.banners?.length > 0 && (
            <HeroBannerWrapper banners={displayData?.banners} />
          )}

          {/* 2. Trust & Delivery Guarantee Strip */}
          <div className="container" style={{ margin: "20px auto 10px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
                background: "#ffffff",
                padding: "16px 20px",
                borderRadius: "14px",
                border: "1px solid #f0f0f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                  <Truck size={20} />
                </div>
                <div>
                  <b style={{ fontSize: "13.5px", color: "var(--sf-dark)", display: "block" }}>Same-Day Delivery</b>
                  <span style={{ fontSize: "12px", color: "#777" }}>Order before 10 PM across Kuwait</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <b style={{ fontSize: "13.5px", color: "var(--sf-dark)", display: "block" }}>100% Genuine Quality</b>
                  <span style={{ fontSize: "12px", color: "#777" }}>Direct from authorized brands</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
                  <Zap size={20} />
                </div>
                <div>
                  <b style={{ fontSize: "13.5px", color: "var(--sf-dark)", display: "block" }}>Instant Easy Checkout</b>
                  <span style={{ fontSize: "12px", color: "#777" }}>Knet, Credit Card, Apple Pay, COD</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#fdf2f8", display: "flex", alignItems: "center", justifyContent: "center", color: "#ec4899" }}>
                  <RefreshCw size={20} />
                </div>
                <div>
                  <b style={{ fontSize: "13.5px", color: "var(--sf-dark)", display: "block" }}>Easy Returns</b>
                  <span style={{ fontSize: "12px", color: "#777" }}>Hassle-free 14-day exchange policy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden SEO heading */}
          <div className="d-none heading-container text-center mt-5">
            <h1>Online Shopping in Kuwait - Sanam Store</h1>
            <p>
              Shop quality products at {process.env.NEXT_PUBLIC_SITE_NAME}. Fast delivery, best prices,
              and amazing deals in Kuwait.
            </p>
          </div>

          {/* 3. Lightning Deals & Clearance Showcase */}
          {(lightningDeals.length > 0 || clearanceDeals.length > 0) && (
            <DealsSection
              lightningProducts={lightningDeals}
              clearanceProducts={clearanceDeals}
            />
          )}

          {/* 4. Top Rated 5-Star Products Section */}
          {topRatedProducts.length > 0 && (
            <TopRatedSection products={topRatedProducts} />
          )}

          {/* 5. Recommended Products Section */}
          {allProducts.length > 0 && (
            <RecommendedSection products={allProducts} />
          )}

          {/* 6. Section Header for Explore Products */}
          <div className="container" style={{ marginTop: "36px" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--sf-primary)", textTransform: "uppercase", letterSpacing: "1px" }}>
                Curated Catalogue
              </span>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "var(--sf-dark)", margin: "4px 0" }}>
                Explore Products & Collections
              </h2>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Endless variety with smart filters and instant shopping experience
              </p>
            </div>
          </div>

          {/* 7. Endless Infinite Scroll Product Feed with Sticky Tabs */}
          <InfiniteProductFeed initialProducts={allProducts} />

          {/* 8. Bottom Banner */}
          {displayData?.bottom_banner && (
            <BottomBanner bottom_banner={displayData?.bottom_banner} />
          )}

          {/* 9. Customer Testimonials */}
          {displayData?.testimonial?.length > 0 && (
            <TestimonialSection testimonial={displayData?.testimonial} />
          )}

          {/* 10. Benefits Grid */}
          <RewardsGrid />
        </>
      )}
    </>
  );
};

export default HomeComponent;