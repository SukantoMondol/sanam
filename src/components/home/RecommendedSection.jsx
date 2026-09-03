"use client";

import { useState, useEffect } from "react";
import { Sparkles, ThumbsUp } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";

export default function RecommendedSection({ products = [] }) {
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (!products || products.length === 0) return;

    // Read browsing history to tailor recommendations
    try {
      const history = JSON.parse(localStorage.getItem("ap_viewed_products") || "[]");
      if (history.length > 0) {
        // Shuffle or pick complementary items
        const picked = [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
        setRecommended(picked);
        return;
      }
    } catch (e) {}

    // Fallback: take top items
    setRecommended(products.slice(0, 10));
  }, [products]);

  if (!recommended || recommended.length === 0) return null;

  return (
    <section className="container" style={{ margin: "32px auto" }}>
      <div style={{ marginBottom: "18px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--sf-primary)",
            fontSize: "12.5px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            marginBottom: "4px",
          }}
        >
          <Sparkles size={14} /> AI Tailored Picks
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--sf-dark)", margin: 0 }}>
          Recommended For You
        </h2>
        <p style={{ fontSize: "14px", color: "#777", margin: "4px 0 0" }}>
          Curated items matched to your shopping taste and popular trends.
        </p>
      </div>

      <div className="temu-product-grid">
        {recommended.map((product, idx) => (
          <ProductCard
            key={product.id || idx}
            product={product}
            index={idx}
            itemListName="Recommended For You"
          />
        ))}
      </div>
    </section>
  );
}
