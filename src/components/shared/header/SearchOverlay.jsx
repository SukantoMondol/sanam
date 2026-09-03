"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowLeft, Camera, Clock, Flame, Sparkles, ChevronRight, ShoppingCart } from "lucide-react";
import useDebounce from "@/utils/useDebounce";
import ImageSearchModal from "./ImageSearchModal";
import axiosInstance from "@/utils/axiosInstance";

const POPULAR_TAGS = [
  "Living Room",
  "Bedroom",
  "Dining Tables",
  "Sofas",
  "Office Chairs",
  "Lighting",
  "Outdoor",
  "Storage",
];

export default function SearchOverlay({ isOpen, onClose, initialQuery = "" }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 180);
  const [recentSearches, setRecentSearches] = useState([]);
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [camModalOpen, setCamModalOpen] = useState(false);

  // Load localStorage on mount / open
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = JSON.parse(localStorage.getItem("ap_recent_search") || "[]");
        setRecentSearches(Array.isArray(saved) ? saved : []);
        const history = JSON.parse(localStorage.getItem("ap_viewed_products") || "[]");
        setBrowsingHistory(Array.isArray(history) ? history : []);
      } catch (e) {
        setRecentSearches([]);
        setBrowsingHistory([]);
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch live product card suggestions
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const fetchSuggestions = async () => {
      try {
        // Try live appstore suggest API first
        const res = await fetch(
          `https://kw.sanamstore.net/en/app/suggest?q=${encodeURIComponent(debouncedQuery)}`,
          { headers: { "X-Requested-With": "XMLHttpRequest" } }
        );

        if (res.ok && active) {
          const data = await res.json();
          if (data?.items && Array.isArray(data.items)) {
            setSuggestions(data.items);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        // Fallback to local axiosInstance
      }

      // Fallback: search-by-keyword
      try {
        const fallbackRes = await axiosInstance.get("/search-by-keyword", {
          params: { keyword: debouncedQuery },
        });
        if (active && fallbackRes?.data?.status && Array.isArray(fallbackRes.data.data)) {
          const mapped = fallbackRes.data.data.map((it, idx) => ({
            id: it.id || idx,
            title: it.keyword || it.name || "Product",
            price: it.price || "0.000 KWD",
            img: it.image || "/assets/images/logo.png",
            off: it.off || 0,
            url: `/search/${encodeURIComponent(it.keyword || it.name || "")}`,
          }));
          setSuggestions(mapped);
        }
      } catch (err) {
        if (active) setSuggestions([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSuggestions();
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const saveRecentSearch = (term, topImg = "") => {
    const clean = (term || "").trim();
    if (!clean) return;
    try {
      const existing = JSON.parse(localStorage.getItem("ap_recent_search") || "[]");
      const filtered = existing.filter((item) => {
        const q = typeof item === "string" ? item : item?.q;
        return (q || "").toLowerCase() !== clean.toLowerCase();
      });
      filtered.unshift({ q: clean, img: topImg });
      const sliced = filtered.slice(0, 10);
      localStorage.setItem("ap_recent_search", JSON.stringify(sliced));
      setRecentSearches(sliced);
    } catch (e) {}
  };

  const clearRecentSearches = () => {
    try {
      localStorage.removeItem("ap_recent_search");
      setRecentSearches([]);
    } catch (e) {}
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const clean = query.trim();
    if (!clean) return;
    saveRecentSearch(clean);
    onClose();
    router.push(`/search/${encodeURIComponent(clean)}`);
  };

  const handleSelectTerm = (term) => {
    saveRecentSearch(term);
    onClose();
    router.push(`/search/${encodeURIComponent(term)}`);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="sf-overlay-backdrop" onClick={onClose}>
        <div className="sf-overlay-panel" onClick={(e) => e.stopPropagation()}>
          {/* Header Input Bar */}
          <div className="sf-overlay-header">
            <button
              type="button"
              className="sf-overlay-back-btn"
              onClick={onClose}
              aria-label="Back"
            >
              <ArrowLeft size={22} />
            </button>

            <form className="sf-overlay-input-wrap" onSubmit={handleSearchSubmit}>
              <span className="sf-overlay-input-icon">
                <Search size={18} />
              </span>

              <input
                ref={inputRef}
                type="search"
                className="sf-overlay-input"
                placeholder="Search thousands of products, brands, styles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                enterKeyHint="search"
              />

              <div className="sf-overlay-actions">
                {query && (
                  <button
                    type="button"
                    className="sf-clear-btn"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear input"
                  >
                    <X size={16} />
                  </button>
                )}

                <button
                  type="button"
                  className="sf-cam-btn"
                  onClick={() => setCamModalOpen(true)}
                  title="Search by image"
                  aria-label="Search by image"
                >
                  <Camera size={18} />
                </button>

                <button
                  type="submit"
                  className="sf-search-submit-btn"
                  aria-label="Search"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Body Content */}
          <div className="sf-overlay-body">
            {/* Live Suggestions State */}
            {query.trim().length >= 2 ? (
              <div>
                <a
                  href={`/search/${encodeURIComponent(query.trim())}`}
                  className="sf-suggest-cta"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSearchSubmit();
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Search size={18} />
                    See all results for "<b>{query}</b>"
                  </span>
                  <ChevronRight size={18} />
                </a>

                {loading ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div className="sf-cam-spinner"></div>
                    <p style={{ fontSize: "13px", color: "#888" }}>Finding best product matches...</p>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div>
                    <div className="sf-section-header">
                      <span className="sf-section-title">
                        <Sparkles size={15} color="var(--sf-primary)" /> Suggested Products
                      </span>
                    </div>
                    <div className="sf-suggest-grid">
                      {suggestions.map((item) => (
                        <a
                          key={item.id}
                          href={item.url || `/search/${encodeURIComponent(item.title)}`}
                          className="sf-suggest-card"
                          onClick={() => {
                            saveRecentSearch(query, item.img);
                            onClose();
                          }}
                        >
                          <div className="sf-suggest-card-media">
                            {item.off > 0 && (
                              <span className="sf-suggest-badge">-{item.off}%</span>
                            )}
                            <img
                              src={item.img || "/assets/images/logo.png"}
                              alt={item.title}
                              className="sf-suggest-card-img"
                              loading="lazy"
                            />
                          </div>
                          <div className="sf-suggest-info">
                            <span className="sf-suggest-title">{item.title}</span>
                            <div className="sf-suggest-prices">
                              <span className="sf-suggest-price-now">{item.price}</span>
                              {item.old && (
                                <span className="sf-suggest-price-old">{item.old}</span>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: "#444" }}>
                      No direct matches for "{query}"
                    </p>
                    <p style={{ fontSize: "13px" }}>
                      Press Enter to perform a full catalogue & AI semantic search.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Default Landing State (Recent Searches + Trends + Browsing History) */
              <div>
                {/* 1. Recent Searches */}
                {recentSearches.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div className="sf-section-header">
                      <span className="sf-section-title">
                        <Clock size={14} /> Recently Searched
                      </span>
                      <button
                        type="button"
                        className="sf-clear-all-link"
                        onClick={clearRecentSearches}
                      >
                        Clear History
                      </button>
                    </div>
                    <div className="sf-chips-grid">
                      {recentSearches.map((item, idx) => {
                        const term = typeof item === "string" ? item : item?.q;
                        const thumb = typeof item === "object" ? item?.img : null;
                        if (!term) return null;
                        return (
                          <button
                            key={idx}
                            type="button"
                            className="sf-chip"
                            onClick={() => handleSelectTerm(term)}
                          >
                            {thumb ? (
                              <img src={thumb} alt="" className="sf-chip-thumb" />
                            ) : (
                              <Clock size={13} color="#888" />
                            )}
                            <span>{term}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Popular & Trending Searches */}
                <div style={{ marginBottom: "20px" }}>
                  <div className="sf-section-header">
                    <span className="sf-section-title">
                      <Flame size={14} color="#e53935" /> Popular Categories & Trends
                    </span>
                  </div>
                  <div className="sf-chips-grid">
                    {POPULAR_TAGS.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="sf-chip"
                        onClick={() => handleSelectTerm(tag)}
                      >
                        <Sparkles size={12} color="var(--sf-primary)" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Browsing History */}
                {browsingHistory.length > 0 && (
                  <div>
                    <div className="sf-section-header">
                      <span className="sf-section-title">
                        <Sparkles size={14} /> Recently Viewed Items
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        overflowX: "auto",
                        paddingBottom: "8px",
                      }}
                    >
                      {browsingHistory.slice(0, 12).map((prod, idx) => (
                        <Link
                          key={idx}
                          href={prod.url || `/product-details/${prod.id}`}
                          onClick={onClose}
                          style={{
                            flex: "0 0 110px",
                            textDecoration: "none",
                            color: "inherit",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              aspectRatio: "1/1",
                              borderRadius: "10px",
                              overflow: "hidden",
                              background: "#f5f5f5",
                              marginBottom: "6px",
                              border: "1px solid #eee",
                            }}
                          >
                            <img
                              src={prod.img || "/assets/images/logo.png"}
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>
                          {prod.price && (
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "var(--sf-primary)",
                                display: "block",
                              }}
                            >
                              {prod.price}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Image Search Modal */}
      <ImageSearchModal
        isOpen={camModalOpen}
        onClose={() => setCamModalOpen(false)}
      />
    </>
  );
}
