"use client";

import { useEffect } from "react";
import { trackViewPromotion } from "@/utils/ga4Ecommerce";

const getPromotionKey = ({
  promotionId,
  promotionName,
  creativeSlot,
  creativeName,
}) =>
  [promotionId, promotionName, creativeSlot, creativeName]
    .filter(Boolean)
    .join("|");

export default function PromotionTracker({
  promotionId,
  promotionName,
  creativeName,
  creativeSlot,
  items,
}) {
  useEffect(() => {
    const promotionKey = getPromotionKey({
      promotionId,
      promotionName,
      creativeSlot,
      creativeName,
    });

    if (!promotionKey) return;

    window.__ga4ViewedPromotions = window.__ga4ViewedPromotions || new Set();
    if (window.__ga4ViewedPromotions.has(promotionKey)) return;

    window.__ga4ViewedPromotions.add(promotionKey);
    trackViewPromotion({
      promotionId,
      promotionName,
      creativeName,
      creativeSlot,
      items,
    });
  }, [promotionId, promotionName, creativeName, creativeSlot, items]);

  return null;
}
