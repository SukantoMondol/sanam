"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/components/shared/ProductCard";
import ViewItemListEvent from "@/components/util/ViewItemListEvent";

const SORT_OPTIONS = [
  { value: "new_to_old", label: "New to Old" },
  { value: "old_to_new", label: "Old to New" },
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
  { value: "price_low_high", label: "Price: Low to High" },
  { value: "price_high_low", label: "Price: High to Low" },
];

const PER_PAGE = 24;

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(null);
  const [sort, setSort] = useState("new_to_old");

  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(false);
  const pageRef = useRef(1);
  // Track whether the sentinel is currently in the viewport
  const sentinelVisibleRef = useRef(false);
  const sortRef = useRef(sort);
  sortRef.current = sort;

  // Stable fetch — reads all mutable values via refs
  const fetchPage = useCallback(async (pageNum, append) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("page", pageNum);
      params.set("per_page", PER_PAGE);
      params.set("sort", sortRef.current);

      const res = await fetch(`/api/all-products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();

      const pagination = json?.data?.products;
      const meta = pagination?.meta ?? pagination; // backend wraps pagination info inside meta
      const newProducts = pagination?.data || [];

      setProducts((prev) => (append ? [...prev, ...newProducts] : newProducts));
      setTotal(meta?.total ?? null);

      const more =
        meta?.current_page != null &&
        meta?.last_page != null &&
        meta.current_page < meta.last_page;

      hasMoreRef.current = more;
      setHasMore(more);
      pageRef.current = pageNum;
    } catch (err) {
      console.error("AllProductsPage fetch error:", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setInitialLoading(false);

      // If sentinel is already visible after this fetch, immediately load next
      if (hasMoreRef.current && sentinelVisibleRef.current) {
        fetchPage(pageRef.current + 1, true);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when sort changes (skip first mount)
  const prevSortRef = useRef(null);
  useEffect(() => {
    if (prevSortRef.current === null) {
      prevSortRef.current = sort;
      return;
    }
    if (prevSortRef.current === sort) return;
    prevSortRef.current = sort;

    pageRef.current = 1;
    hasMoreRef.current = false;
    sentinelVisibleRef.current = false;
    setProducts([]);
    setHasMore(false);
    fetchPage(1, false);
  }, [sort, fetchPage]);

  // Single stable IntersectionObserver — created once
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        sentinelVisibleRef.current = isVisible;
        if (isVisible && !loadingRef.current && hasMoreRef.current) {
          fetchPage(pageRef.current + 1, true);
        }
      },
      { rootMargin: "400px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchPage]);

  return (
    <div className="all-products-page pb-5">
      {/* ─── Hero Section ─── */}
      <section className="all-products-hero py-4 py-md-5">
        <div className="container text-center text-white px-3">
          <h1 className="all-products-hero__title fw-bold mb-2">
            Shop Our Full Collection
          </h1>
          <p className="all-products-hero__subtitle mb-0 mx-auto">
            Discover hundreds of handpicked pieces crafted for modern living.
          </p>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div className="container">
        {/* Filter bar — same pattern as FilterSortBar.jsx used on category pages */}
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center px-3 px-sm-4 py-3 rounded-1 bg-light-gray my-3 my-md-4">
          {total != null && !initialLoading && (
            <span className="text-muted small">
              {total.toLocaleString()} results
            </span>
          )}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="form-select w-auto ms-auto"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        {initialLoading ? (
          <div className="row g-3 g-md-4 p-2 p-md-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="col-sm-6 col-md-4 col-xxl-3">
                <div className="all-products-skeleton-card" />
              </div>
            ))}
          </div>
        ) : products.length === 0 && !loading ? (
          <div className="text-center py-5">
            <p className="text-muted fs-5">No products found.</p>
          </div>
        ) : (
          <div className="row g-3 g-md-4 p-2 p-md-3">
            <ViewItemListEvent
              products={products}
              itemListId={`all-products-${sort}`}
              itemListName="All Products"
            />
            {products.map((product, index) => (
              <div key={`${product.id}-${index}`} className="col-sm-6 col-md-4 col-xxl-3">
                <ProductCard
                  product={product}
                  index={index}
                  itemListId={`all-products-${sort}`}
                  itemListName="All Products"
                  sizes="(max-width: 576px) 90vw, (max-width: 992px) 45vw, 280px"
                  isCritical={index < 4}
                />
              </div>
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="all-products-sentinel" aria-hidden="true" />

        {/* Loading indicator */}
        {loading && !initialLoading && (
          <div className="d-flex flex-column align-items-center gap-2 py-4 text-muted small">
            <div className="all-products-loading__spinner" />
            <span>Loading more products…</span>
          </div>
        )}

        {/* End of results */}
        {!hasMore && products.length > 0 && !loading && (
          <p className="text-center text-muted small pt-4">
            You&apos;ve seen all {total?.toLocaleString()} products
          </p>
        )}
      </div>
    </div>
  );
}
