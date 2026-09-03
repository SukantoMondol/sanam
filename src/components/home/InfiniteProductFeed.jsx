"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import ProductCard from "@/components/shared/ProductCard";
import { Sparkles, Zap, Star, Award } from "lucide-react";

export default function InfiniteProductFeed({ initialProducts = [] }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(15);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadRef = useRef(null);

  // Filter products based on selected tab
  const filteredProducts = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) return [];

    switch (activeFilter) {
      case "deals":
        return initialProducts.filter(
          (p) => (p?.price?.discount > 0) || (p?.old_price && p?.old_price > p?.retail_price)
        );
      case "five_star":
        return initialProducts.filter(
          (p) => (p?.review?.average_rating >= 4.5) || (p?.rating >= 4.5)
        );
      case "best_seller":
        return [...initialProducts].sort((a, b) => (b?.review?.total_review || 0) - (a?.review?.total_review || 0));
      default:
        return initialProducts;
    }
  }, [initialProducts, activeFilter]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(15);
    setHasMore(filteredProducts.length > 15);
  }, [activeFilter, filteredProducts]);

  // Infinite scroll trigger via IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => {
              const next = prev + 10;
              if (next >= filteredProducts.length) {
                setHasMore(false);
              }
              return next;
            });
            setLoading(false);
          }, 350);
        }
      },
      { rootMargin: "500px" }
    );

    const currentElem = loadRef.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [hasMore, loading, filteredProducts.length]);

  const displayedItems = filteredProducts.slice(0, visibleCount);

  return (
    <div className="container" style={{ marginTop: "24px", marginBottom: "40px" }}>
      {/* Sticky Filter Bar */}
      <div className="sf-sticky-filters">
        <div className="sf-filter-pills">
          <button
            type="button"
            className={`sf-filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            <Sparkles size={14} /> All Products
          </button>

          <button
            type="button"
            className={`sf-filter-btn ${activeFilter === "deals" ? "active" : ""}`}
            onClick={() => setActiveFilter("deals")}
          >
            <Zap size={14} /> 🔥 Hot Deals
          </button>

          <button
            type="button"
            className={`sf-filter-btn ${activeFilter === "five_star" ? "active" : ""}`}
            onClick={() => setActiveFilter("five_star")}
          >
            <Star size={14} /> ⭐ 5-Star Rated
          </button>

          <button
            type="button"
            className={`sf-filter-btn ${activeFilter === "best_seller" ? "active" : ""}`}
            onClick={() => setActiveFilter("best_seller")}
          >
            <Award size={14} /> 🏆 Best Sellers
          </button>
        </div>
      </div>

      {/* Main Endless Product Grid */}
      {displayedItems.length > 0 ? (
        <div className="temu-product-grid">
          {displayedItems.map((product, idx) => (
            <ProductCard
              key={`${product.id}-${idx}`}
              product={product}
              index={idx}
              isCritical={idx < 4}
              itemListName={`Infinite Feed - ${activeFilter}`}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>No products found in this category.</p>
        </div>
      )}

      {/* Infinite Scroll Trigger Anchor */}
      {hasMore && (
        <div ref={loadRef} className="sf-feed-spinner-wrap">
          {loading && <div className="sf-cam-spinner"></div>}
        </div>
      )}

      {!hasMore && displayedItems.length > 0 && (
        <div className="sf-feed-end-msg">
          🎉 You've reached the end of this collection!
        </div>
      )}
    </div>
  );
}
