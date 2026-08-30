"use client";

import Link from "next/link";
import Image from "next/image";
import ImageComponent from "../UI/Cards/ImageComponent";
import PromotionTracker from "@/components/util/PromotionTracker";
import { trackSelectPromotion } from "@/utils/ga4Ecommerce";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

function getSafeImageUrl(url) {
  if (!url) return "/assets/images/no-image.png";
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    return url.replace(/127\.0\.0\.1|localhost/, hostname);
  }
  return url;
}

export default function HeroBanner({ banners: initialBanners }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState(initialBanners || []);

  // Update banners with safe host URLs
  useEffect(() => {
    if (Array.isArray(initialBanners) && initialBanners.length > 0) {
      const safeBanners = initialBanners.map((b) => ({
        ...b,
        picture: getSafeImageUrl(b.picture),
        mobile_picture: getSafeImageUrl(b.mobile_picture || b.picture),
      }));
      setBanners(safeBanners);
    }
  }, [initialBanners]);

  const bannerCount = banners.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (bannerCount || 1));
  }, [bannerCount]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + (bannerCount || 1)) % (bannerCount || 1));
  }, [bannerCount]);

  // Robust Auto sliding interval (every 3.5 seconds)
  useEffect(() => {
    if (bannerCount <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerCount);
    }, 3500);

    return () => clearInterval(timer);
  }, [bannerCount]);

  // If no banners or empty array, show placeholder
  if (!banners || banners.length === 0) {
    return (
      <div
        style={{
          height: "420px",
          background: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6c757d",
        }}
      >
        No banners available
      </div>
    );
  }

  const currentBanner = banners[currentIndex] || banners[0];
  const hasBannerUrl = Boolean(currentBanner?.url && currentBanner.url !== "#");

  const promotion = {
    promotionId: String(currentBanner?.id || `home_hero_banner_${currentIndex}`),
    promotionName: currentBanner?.title || currentBanner?.alt_text || "Homepage Hero Banner",
    creativeName: currentBanner?.alt_text || currentBanner?.title || "Homepage Hero Banner",
    creativeSlot: `home_hero_${currentIndex + 1}`,
  };

  const handlePromotionClick = () => {
    if (!hasBannerUrl) return;
    trackSelectPromotion(promotion);
  };

  // Single Banner
  if (bannerCount === 1) {
    const banner = banners[0];
    const linkUrl = Boolean(banner?.url && banner.url !== "#") ? banner.url : null;

    const contentDesktop = (
      <div className="d-none d-md-block container">
        <ImageComponent
          className="slider-image"
          width={1576}
          height={450}
          src={banner.picture}
          alt={banner.title || "Banner"}
          fetchPriority="high"
          loading="eager"
          quality={80}
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1576px"
        />
      </div>
    );

    const contentMobile = banner.mobile_picture ? (
      <div className="d-block d-md-none" style={{ marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", overflow: "hidden" }}>
        <div style={{ position: "relative", width: "100vw", maxWidth: "100vw", aspectRatio: "680 / 380", overflow: "hidden" }}>
          <Image
            src={banner.mobile_picture}
            alt={banner.title || "Banner"}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
            quality={80}
          />
        </div>
      </div>
    ) : null;

    return (
      <>
        <PromotionTracker {...promotion} />
        {linkUrl ? (
          <Link href={linkUrl} onClick={handlePromotionClick} aria-label={banner.title}>
            {contentDesktop}
            {contentMobile}
          </Link>
        ) : (
          <>
            {contentDesktop}
            {contentMobile}
          </>
        )}
      </>
    );
  }

  // Multiple Banners - Auto Sliding Horizontal Track Carousel
  return (
    <div className="hero-slider-section position-relative overflow-hidden my-1">
      <PromotionTracker {...promotion} />

      {/* Desktop Banner View */}
      <div className="d-none d-md-block container position-relative">
        <div className="hero-slider-inner position-relative overflow-hidden rounded-3 shadow-sm">
          {/* Sliding Track */}
          <div
            className="hero-slider-track d-flex"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
              width: "100%",
            }}
          >
            {banners.map((item, idx) => {
              const itemUrl = Boolean(item?.url && item.url !== "#") ? item.url : null;

              const slideImg = (
                <ImageComponent
                  className="slider-image w-100"
                  width={1576}
                  height={450}
                  src={item.picture}
                  alt={item.title || `Banner ${idx + 1}`}
                  fetchPriority={idx === 0 ? "high" : "low"}
                  loading={idx === 0 ? "eager" : "lazy"}
                  quality={85}
                  sizes="(max-width: 1024px) 90vw, 1576px"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "460px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              );

              return (
                <div
                  key={item.id || idx}
                  className="hero-slide-item flex-shrink-0 w-100"
                  style={{ width: "100%" }}
                >
                  {itemUrl ? (
                    <Link href={itemUrl} onClick={handlePromotionClick} aria-label={item.title || "Banner"}>
                      {slideImg}
                    </Link>
                  ) : (
                    slideImg
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Left / Right Navigation Chevrons */}
          <button
            type="button"
            className="hero-slider-nav hero-slider-nav--prev"
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            aria-label="Previous Slide"
          >
            ‹
          </button>
          <button
            type="button"
            className="hero-slider-nav hero-slider-nav--next"
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            aria-label="Next Slide"
          >
            ›
          </button>

          {/* Desktop Pagination Dots */}
          <div className="hero-slider-dots d-flex align-items-center justify-content-center gap-2 position-absolute start-50 translate-middle-x">
            {banners.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                className={`hero-slider-dot ${dotIdx === currentIndex ? "hero-slider-dot--active" : ""}`}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Banner View */}
      <div className="d-block d-md-none position-relative overflow-hidden">
        <div style={{ position: "relative", width: "100vw", aspectRatio: "680 / 380", overflow: "hidden" }}>
          <div
            className="d-flex h-100"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
              width: "100%",
            }}
          >
            {banners.map((item, idx) => {
              const itemUrl = Boolean(item?.url && item.url !== "#") ? item.url : null;
              const imgSrc = item.mobile_picture || item.picture;

              const mobileImg = (
                <div style={{ position: "relative", width: "100vw", height: "100%", aspectRatio: "680 / 380" }}>
                  <Image
                    src={imgSrc}
                    alt={item.title || `Banner ${idx + 1}`}
                    fill
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                    priority={idx === 0}
                    quality={85}
                  />
                </div>
              );

              return (
                <div
                  key={item.id || idx}
                  className="flex-shrink-0"
                  style={{ width: "100vw", height: "100%" }}
                >
                  {itemUrl ? (
                    <Link href={itemUrl} onClick={handlePromotionClick} aria-label={item.title || "Banner"}>
                      {mobileImg}
                    </Link>
                  ) : (
                    mobileImg
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Pagination Dots */}
          <div
            className="d-flex align-items-center justify-content-center gap-1 position-absolute start-50 translate-middle-x"
            style={{ bottom: "10px", zIndex: 10 }}
          >
            {banners.map((_, dotIdx) => (
              <span
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                style={{
                  width: dotIdx === currentIndex ? "16px" : "6px",
                  height: "6px",
                  borderRadius: "4px",
                  background: dotIdx === currentIndex ? "#fb7701" : "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
