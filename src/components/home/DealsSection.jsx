"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Flame, Clock, ChevronRight } from "lucide-react";

export default function DealsSection({ lightningProducts = [], clearanceProducts = [] }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 34, seconds: 12 });

  // Live countdown timer ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatPad = (n) => String(n).padStart(2, "0");

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return "0.000 KWD";
    return `${Number(amount).toFixed(3)} KWD`;
  };

  const renderTrack = (products, type) => {
    if (!products || products.length === 0) return null;

    return (
      <div className="sf-deal-card-box">
        <div className="sf-deal-header">
          <div className="sf-deal-badge-title">
            <span className={`sf-deal-badge ${type === "clearance" ? "clearance" : ""}`}>
              {type === "lightning" ? (
                <>
                  <Zap size={16} fill="currentColor" /> Lightning Deals
                </>
              ) : (
                <>
                  <Flame size={16} fill="currentColor" /> Clearance Sale
                </>
              )}
            </span>

            {type === "lightning" && (
              <div className="sf-deal-timer">
                <Clock size={14} color="#e65100" />
                <span>
                  Ends in {formatPad(timeLeft.hours)}h : {formatPad(timeLeft.minutes)}m : {formatPad(timeLeft.seconds)}s
                </span>
              </div>
            )}
          </div>

          <Link
            href={`/all-products?filter=${type}`}
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--sf-primary)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            See All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="sf-deal-track">
          {products.map((item, idx) => {
            const payable = item?.price?.payable_price || item?.retail_price || 0;
            const original = item?.price?.price || item?.old_price || 0;
            const hasDiscount = original > payable;
            const discountPercent = hasDiscount && original > 0
              ? Math.round(((original - payable) / original) * 100)
              : 0;
            const img = item?.photo || item?.image || "/assets/images/logo.png";
            const productSlug = item?.slug || item?.id;

            return (
              <Link
                key={item?.id || idx}
                href={`/product-details/${productSlug}`}
                className="sf-deal-item"
              >
                <div style={{ position: "relative" }}>
                  <img src={img} alt={item?.name || item?.title || "Deal product"} className="sf-deal-item-img" loading="lazy" />
                  {discountPercent > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "6px",
                        left: "6px",
                        background: type === "clearance" ? "var(--sf-accent-red)" : "var(--sf-primary)",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                <div className="sf-deal-item-body">
                  <p
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 500,
                      color: "var(--sf-dark)",
                      margin: "0 0 4px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item?.name || item?.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span className="sf-deal-item-price">{formatPrice(payable)}</span>
                    {hasDiscount && (
                      <span className="sf-deal-item-old">{formatPrice(original)}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="sf-deals-container container">
      {lightningProducts.length > 0 && renderTrack(lightningProducts, "lightning")}
      {clearanceProducts.length > 0 && renderTrack(clearanceProducts, "clearance")}
    </section>
  );
}
