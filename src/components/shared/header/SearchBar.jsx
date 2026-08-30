"use client";

import axiosInstance from "@/utils/axiosInstance";
import useDebounce from "@/utils/useDebounce";
import { trackSearch } from "@/utils/ga4Ecommerce";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SearchBar = ({ className }) => {
  const router = useRouter();
  const containerRef = useRef(null);
  const [IsFieldFocused, setIsFieldFocused] = useState(false);
  const [query, setQuery] = useState(null);
  const debouncedSearchTerm = useDebounce(query);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    let cancelToken;
    
    if (debouncedSearchTerm) {
      cancelToken = axiosInstance.CancelToken?.source();
      const fetchSearchResults = async () => {
        try {
          const response = await axiosInstance.get("/search-by-keyword", {
            params: { keyword: debouncedSearchTerm },
            cancelToken: cancelToken?.token,
          });
          if (response?.data?.status) {
            setSearchResults(response?.data?.data);
          }
        } catch (error) {
          // Ignore cancelled requests and stale errors
          if (!axiosInstance.isCancel?.(error)) {
            console.warn("Search error:", error?.message);
          }
        }
      };
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }

    return () => {
      cancelToken?.cancel?.("Request cancelled due to new search");
    };
  }, [debouncedSearchTerm]);

  return (
    <div
      ref={containerRef}
      onFocus={() => setIsFieldFocused(true)}
      onBlur={(event) => {
        if (!containerRef.current.contains(event.relatedTarget)) {
          setIsFieldFocused(false);
        }
      }}
      className={`d-flex flex-grow-1 ${className} align-items-center mx-lg-3`}
    >
      <div className="w-100 searchContainer position-relative">
        <form
          className="d-flex align-items-center position-relative w-100 h-100"
          onSubmit={(e) => {
            e.preventDefault();
            trackSearch(debouncedSearchTerm);
            if (debouncedSearchTerm) {
              router.push(`/search/${debouncedSearchTerm}`);
            }
          }}
        >
          {/* Mobile Left Search Icon (Exact Temu match) */}
          <span className="temu-mobile-search-icon-left d-lg-none position-absolute start-0 top-50 translate-middle-y ms-2 ps-1 d-flex align-items-center">
            <Search size={15} color="#666666" />
          </span>

          <input
            onChange={(event) => setQuery(event.target.value.trim())}
            type="text"
            placeholder="Search products in Sanam..."
            className="form-control p-2 border-1 border-dark text-dark"
          />

          {/* Desktop Search Button */}
          <button
            aria-label="Search"
            type="submit"
            className="searchButton position-absolute end-0 top-50 translate-middle-y bg-purple d-none d-lg-flex"
          >
            <Search className="search-bar-icon " />
          </button>
        </form>

        <>
          {searchResults?.length > 0 && IsFieldFocused ? (
            <div className="searchResults shadow-sm">
              <div className="popularSearches mb-2 d-flex flex-wrap gap-2 align-items-center justify-content-center">
                <p>Popular Searches: </p>
                <div className="d-flex flex-wrap gap-2">
                  {["Tools", "Camping", "Travel", "Kettles", "Lights"].map(
                    (item) => (
                      <Link
                        key={item}
                        href={`/search/${item}`}
                        className="searchResultItem"
                        onClick={() => trackSearch(item)}
                      >
                        {item}
                      </Link>
                    )
                  )}
                </div>
              </div>

              {searchResults?.map((item) => (
                <Link
                  key={item?.id}
                  href={`/search/${item?.keyword}`}
                  className="searchResultItem"
                  onClick={() => trackSearch(item?.keyword)}
                >
                  {item?.keyword}
                </Link>
              ))}
            </div>
          ) : (
            <></>
          )}
        </>
      </div>
    </div>
  );
};

export default SearchBar;

