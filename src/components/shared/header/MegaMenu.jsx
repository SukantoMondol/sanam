"use client";

import Link from "next/link";
import Image from "next/image";
import {
  trackSelectPromotion,
  trackViewPromotion,
} from "@/utils/ga4Ecommerce";

function splitIntoColumns(children, numCols) {
  const columns = Array.from({ length: numCols }, () => []);
  const totalHeight = children.reduce(
    (sum, c) => sum + 1 + (c.children?.length || 0),
    0
  );
  const targetHeight = Math.ceil(totalHeight / numCols);
  let colIdx = 0;
  let colHeight = 0;
  for (const child of children) {
    const childHeight = 1 + (child.children?.length || 0);
    if (colHeight > 0 && colHeight + childHeight > targetHeight && colIdx < numCols - 1) {
      colIdx++;
      colHeight = 0;
    }
    columns[colIdx].push(child);
    colHeight += childHeight;
  }
  return columns;
}

const MegaMenu = ({ category }) => {
  if (!category?.children?.length) return null;

  const hasBanner =
    category?.banner_photos?.[1]?.banner_photo ||
    category?.banner_photos?.[2]?.banner_photo;

  const numCols = hasBanner ? 3 : 4;
  const columns = splitIntoColumns(category.children, numCols);
  const getBannerPromotion = (banner, index) => ({
    promotionId: String(
      banner?.id || `${category?.slug || category?.id}_mega_menu_banner_${index}`
    ),
    promotionName:
      banner?.title ||
      banner?.alt_text ||
      `${category?.name || "Category"} Mega Menu Banner ${index}`,
    creativeName:
      banner?.alt_text ||
      banner?.title ||
      `${category?.name || "Category"} Mega Menu Banner`,
    creativeSlot: `mega_menu_banner_${index}`,
  });

  const trackMegaMenuPromotionViews = () => {
    if (!hasBanner) return;

    window.__ga4ViewedPromotions = window.__ga4ViewedPromotions || new Set();
    [1, 2].forEach((index) => {
      const banner = category?.banner_photos?.[index];
      if (!banner?.banner_photo) return;

      const promotion = getBannerPromotion(banner, index);
      const promotionKey = [
        promotion.promotionId,
        promotion.promotionName,
        promotion.creativeSlot,
      ].join("|");

      if (window.__ga4ViewedPromotions.has(promotionKey)) return;

      window.__ga4ViewedPromotions.add(promotionKey);
      trackViewPromotion(promotion);
    });
  };

  const trackMegaMenuPromotionClick = (banner, index) => {
    if (!banner?.redirect_url || banner.redirect_url === "#") return;

    trackSelectPromotion(getBannerPromotion(banner, index));
  };

  return (
    <div
      className="megaMenuContainer w-100"
      onMouseEnter={trackMegaMenuPromotionViews}
    >
      <div className="container mega-menu-inner">
        <div className="row">
          <div className={hasBanner ? "col-lg-9" : "col-lg-12"}>
            <div className="mega-menu-grid">
              {columns.map((col, colIndex) => (
                <div className="mega-menu-col-wrapper" key={colIndex}>
                  {col.map((child) => (
                    <div className="mega-menu-column" key={child?.id}>
                      <Link
                        className="mega-menu-group-title"
                        href={`/category/${child?.slug}`}
                      >
                        {child?.name}
                      </Link>
                      {child?.children?.length > 0 && (
                        <ul className="mega-menu-subitems list-unstyled mb-0">
                          {child.children.map((subChild) => (
                            <li key={subChild?.id}>
                              <Link
                                className="mega-menu-sub-link"
                                href={`/category/${subChild?.slug}`}
                              >
                                {subChild?.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {hasBanner && (
            <div className="col-lg-3">
              {category?.banner_photos?.[1]?.banner_photo && (
                <Link
                  className="mega-menu-image-link"
                  href={category?.banner_photos[1]?.redirect_url || "/"}
                  onClick={() =>
                    trackMegaMenuPromotionClick(category?.banner_photos[1], 1)
                  }
                >
                  <Image
                    src={category?.banner_photos[1]?.banner_photo}
                    alt={category?.banner_photos[1]?.alt_text || "Category Banner"}
                    width={400}
                    height={230}
                    className="img-fluid mega-menu-image mb-2"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </Link>
              )}
              {category?.banner_photos?.[2]?.banner_photo && (
                <Link
                  className="mega-menu-image-link"
                  href={category?.banner_photos[2]?.redirect_url || "/"}
                  onClick={() =>
                    trackMegaMenuPromotionClick(category?.banner_photos[2], 2)
                  }
                >
                  <Image
                    src={category?.banner_photos[2]?.banner_photo}
                    alt={category?.banner_photos[2]?.alt_text || "Category Banner"}
                    width={400}
                    height={230}
                    className="img-fluid mega-menu-image mb-2"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
