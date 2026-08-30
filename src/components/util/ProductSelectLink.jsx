"use client";

import Link from "next/link";
import { trackSelectItem } from "@/utils/ga4Ecommerce";

export default function ProductSelectLink({
  href,
  product,
  index,
  itemListId,
  itemListName,
  children,
}) {
  const handleClick = () => {
    trackSelectItem(product, {
      index,
      itemListId,
      itemListName,
    });
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
