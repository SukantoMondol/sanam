"use client";

import Image from "next/image";
import Link from "next/link";
import ImageComponent from "./UI/Cards/ImageComponent";
import PromotionTracker from "@/components/util/PromotionTracker";
import { trackSelectPromotion } from "@/utils/ga4Ecommerce";

export default function BannerSection({
  imageSrc,
  mobileImageSrc,
  title = "Default Title",
  buttonText = "Click Me",
  titleColor = "#000",
  href,
  promotionId,
  promotionName,
  creativeName,
  creativeSlot,
}) {
  if (!imageSrc && !mobileImageSrc) {
    return null;
  }
  if (imageSrc === "/placeholder.svg" || imageSrc === "/assets/images/logo.png") {
    return null;
  }

  const hasPromotionImage = Boolean(imageSrc);
  const hasHref = Boolean(href && href !== "#");
  const promotion = {
    promotionId: String(promotionId || title || imageSrc),
    promotionName: promotionName || title,
    creativeName: creativeName || title,
    creativeSlot: creativeSlot || "banner_section",
  };

  const handlePromotionClick = () => {
    if (!hasHref) return;

    trackSelectPromotion(promotion);
  };

  const renderDesktopBanner = () => (
    <ImageComponent
      src={imageSrc}
      alt={title}
      width={1576}
      height={354}
      sizes="(max-width: 768px) 100vw, 1576px"
      className="object-fit-cover img-fluid rounded-3 bannerImage"
    />
  );

  const renderMobileBanner = () => (
    <div style={{ position: "relative", width: "100vw", maxWidth: "100vw", aspectRatio: "680 / 380", overflow: "hidden" }}>
      <Image
        src={mobileImageSrc}
        alt={title}
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
    </div>
  );

  return (
    <>
      {hasPromotionImage && <PromotionTracker {...promotion} />}
      {/* Desktop banner */}
      <div className="d-none d-md-block hero-banner container mt-100">
        {hasHref ? (
          <Link href={href} onClick={handlePromotionClick}>
            {renderDesktopBanner()}
          </Link>
        ) : (
          renderDesktopBanner()
        )}
      </div>
      {/* Mobile banner */}
      {mobileImageSrc && (
        <div className="d-block d-md-none" style={{ marginTop: "100px", overflow: "hidden" }}>
          {hasHref ? (
            <Link href={href} onClick={handlePromotionClick}>
              {renderMobileBanner()}
            </Link>
          ) : (
            renderMobileBanner()
          )}
        </div>
      )}
    </>
  );
}
