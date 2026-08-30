"use client";

import { useEffect, useRef } from "react";
import { trackViewItemList } from "@/utils/ga4Ecommerce";

export default function ViewItemListEvent({
  products,
  itemListId,
  itemListName,
}) {
  const lastSignatureRef = useRef("");

  useEffect(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return;
    }

    const signature = [
      itemListId,
      products.map((product) => product?.id || product?.sku || product?.slug).join("|"),
    ].join(":");

    if (lastSignatureRef.current === signature) {
      return;
    }

    lastSignatureRef.current = signature;
    trackViewItemList(products, { itemListId, itemListName });
  }, [products, itemListId, itemListName]);

  return null;
}
