"use client";
import { useEffect, useRef, useState } from "react";
import ProductListing from "@/components/products/productlisting/productListing";
import Loader from "@/components/UI/Shared/Loader";
import axiosInstance from "@/utils/axiosInstance";

export default function SearchClient({ keyword, searchParams }) {
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialSearchParams = useRef(searchParams);
  const [effectiveKeyword, setEffectiveKeyword] = useState(() => {
    try {
      return keyword ? decodeURIComponent(String(keyword)) : "";
    } catch (e) {
      return String(keyword || "");
    }
  });

  useEffect(() => {
    try {
      setEffectiveKeyword(keyword ? decodeURIComponent(String(keyword)) : "");
    } catch (e) {
      setEffectiveKeyword(String(keyword || ""));
    }
  }, [keyword]);

  useEffect(() => {
    // debug log for troubleshooting when keyword seems missing on client
    // eslint-disable-next-line no-console
    console.log("DEBUG SearchClient props - keyword:", keyword, "effectiveKeyword:", effectiveKeyword, "searchParams:", searchParams);
  }, [keyword, effectiveKeyword, initialSearchParams.current]);

  useEffect(() => {
    if (!effectiveKeyword || typeof effectiveKeyword !== "string" || !effectiveKeyword.trim()) {
      setError("No keyword provided.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    axiosInstance
      .get("/product-search", {
        params: {
          search: effectiveKeyword,
          ...initialSearchParams.current,
        },
      })
      .then((response) => {
        if (response?.data?.status) {
          setProductsData(response.data.data);
          // update keyword count (best-effort)
          axiosInstance
            .get("/search-by-keyword", {
              params: { keyword: decodeURIComponent(keyword), save: true },
            })
            .catch(() => {
              // ignore errors from keyword analytics
            });
        } else {
          setError(response?.data?.status_message || "No results found.");
        }
      })
      .catch((err) => {
        setError(err?.message || "Failed to fetch products.");
      })
      .finally(() => setLoading(false));
  }, [keyword]);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="container py-5 text-danger fw-bold text-center">
        {error}
      </div>
    );
  if (!productsData || !productsData.products?.data?.length)
    return (
      <div className="container py-5 text-center">No products found.</div>
    );
  return <ProductListing productsData={productsData} />;
}
