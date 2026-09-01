"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProductListing from "@/components/products/productlisting/productListing";
import Breadcrumb from "../UI/Shared/Breadcrumb";
import { useParams } from "next/navigation";
import liveCategories from "@/data/liveCategories.json";

const LIVE_BACKEND = "https://kw.sanamstore.net";

function formatImageUrl(path) {
  if (!path) return "/assets/images/logo.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${LIVE_BACKEND}/${path.replace(/^\//, "")}`;
}

const Category = ({ productsData: initialData }) => {
  const [data, setData] = useState(initialData || {});
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const catSlug = params?.slug;

  // Find category name from liveCategories tree
  const currentCategory = (liveCategories || []).find(
    (c) => String(c.id) === String(catSlug) || String(c.slug) === String(catSlug)
  );
  const categoryTitle = currentCategory?.name || initialData?.category_name || "Products";

  useEffect(() => {
    if (!catSlug) return;

    setLoading(true);
    const body = new URLSearchParams();
    const cleanId = String(catSlug).replace(/^category-/, "");
    body.append("cat_id", cleanId);

    axios
      .post(`${LIVE_BACKEND}/api/iosv1/getProducts`, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        const productLists = res?.data?.data?.productLists || [];
        if (productLists.length > 0) {
          const formattedProducts = productLists.map((item, idx) => {
            const retailPrice = Number(item?.retail_price) || 0;
            const oldPrice = Number(item?.old_price) || 0;
            const price = oldPrice > retailPrice ? oldPrice : retailPrice;
            const discount = oldPrice > retailPrice ? oldPrice - retailPrice : 0;

            return {
              id: item?.id || idx + 1,
              name: item?.title,
              title: item?.title,
              slug: String(item?.id || idx + 1),
              photo: formatImageUrl(item?.image),
              image: formatImageUrl(item?.image),
              photo_alt: item?.title,
              price: {
                price: price,
                payable_price: retailPrice,
                discount: discount,
                discount_percentage: price > 0 ? Math.round((discount / price) * 100) : 0,
              },
              rating: 4.8,
              review: {
                average_rating: 4.8,
                total_review: 12,
              },
              stock_status: item?.is_stock > 0 ? "in_stock" : "out_of_stock",
            };
          });

          setData({
            category_name: categoryTitle,
            products: formattedProducts,
            pagination: {
              total: formattedProducts.length,
              current_page: 1,
              last_page: 1,
            },
            bread_crumb: [
              { name: "Home", slug: "/" },
              { name: categoryTitle, slug: `/category/${catSlug}` },
            ],
          });
        }
      })
      .catch((err) => {
        console.error("Client getProducts error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [catSlug, categoryTitle]);

  const displayData = data?.products?.length > 0 ? data : initialData;

  return (
    <>
      <h1 className="d-none">{displayData?.category_name || categoryTitle}</h1>
      <Breadcrumb
        items={(displayData?.bread_crumb || [
          { name: "Home", slug: "/" },
          { name: categoryTitle, slug: `/category/${catSlug}` },
        ]).map((item) => ({
          label: item?.name,
          href: item?.slug ? (item.slug.startsWith("/") ? item.slug : `/category/${item.slug}`) : "/",
        }))}
      />

      <div className="container">
        <ProductListing productsData={displayData} />
      </div>
    </>
  );
};

export default Category;
