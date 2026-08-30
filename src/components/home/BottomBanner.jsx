import Image from "next/image";
import ImageComponent from "../UI/Cards/ImageComponent";
import PromotionTracker from "@/components/util/PromotionTracker";

export default function BottomBanner({ bottom_banner }) {
  if (!bottom_banner?.picture && !bottom_banner?.mobile_picture) {
    return null;
  }

  const promotion = {
    promotionId: String(bottom_banner?.id || "home_bottom_banner"),
    promotionName:
      bottom_banner?.title || bottom_banner?.alt_text || "Homepage Bottom Banner",
    creativeName:
      bottom_banner?.alt_text || bottom_banner?.title || "Homepage Bottom Banner",
    creativeSlot: "home_bottom_banner",
  };

  return (
    <>
      {bottom_banner?.picture && <PromotionTracker {...promotion} />}
      {/* Desktop banner */}
      {bottom_banner?.picture && (
        <div className="d-none d-md-block hero-banner container my-4">
          <ImageComponent
            src={bottom_banner.picture}
            alt={bottom_banner?.alt_text || "Bottom Banner"}
            width={1116}
            height={251}
            sizes="(max-width: 768px) 100vw, 1116px"
            className="object-fit-cover img-fluid rounded-3 h-100 w-100 bannerImage"
          />
        </div>
      )}
      {/* Mobile banner */}
      {bottom_banner?.mobile_picture && (
        <div className="d-block d-md-none my-3" style={{ overflow: "hidden" }}>
          <div style={{ position: "relative", width: "100vw", maxWidth: "100vw", aspectRatio: "680 / 380", overflow: "hidden" }}>
            <Image
              src={bottom_banner.mobile_picture}
              alt={bottom_banner?.alt_text || "Bottom Banner"}
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
