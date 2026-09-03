"use client";

import Link from "next/link";
import { Star, ShieldCheck, Award } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";

export default function TopRatedSection({ products = [] }) {
  if (!products || products.length === 0) return null;

  // Filter or prioritize items with high ratings
  const topPicks = products.slice(0, 10);

  return (
    <section className="sf-toprated-section container">
      <div className="sf-toprated-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div className="sf-toprated-badge">
              <Award size={15} /> 5-Star Customer Favorites
            </div>
            <h2 className="sf-toprated-title">
              Top Rated Products in Kuwait
            </h2>
            <p style={{ fontSize: "14px", color: "#666", margin: "4px 0 0" }}>
              Highest customer satisfaction, verified reviews, and premium build quality.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#fff",
              padding: "6px 14px",
              borderRadius: "999px",
              border: "1px solid #fed7aa",
              boxShadow: "0 2px 6px rgba(245, 158, 11, 0.1)",
            }}
          >
            <ShieldCheck size={18} color="#16a34a" />
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#166534" }}>
              100% Genuine & Quality Guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 5-star items */}
      <div className="temu-product-grid">
        {topPicks.map((product, idx) => (
          <ProductCard
            key={product.id || idx}
            product={product}
            index={idx}
            isCritical={idx < 4}
            itemListName="Top Rated 5-Star Products"
          />
        ))}
      </div>
    </section>
  );
}
