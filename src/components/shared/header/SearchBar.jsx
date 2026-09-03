"use client";

import { useState } from "react";
import { Search, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import SearchOverlay from "./SearchOverlay";
import ImageSearchModal from "./ImageSearchModal";

const SearchBar = ({ className }) => {
  const router = useRouter();
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [camModalOpen, setCamModalOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleOpenOverlay = () => {
    setOverlayOpen(true);
  };

  const handleOpenCam = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCamModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    } else {
      setOverlayOpen(true);
    }
  };

  return (
    <>
      <div className={`sf-search-wrap ${className || ""}`}>
        <form onSubmit={handleSubmit} className="position-relative w-100">
          <span className="sf-search-left-icon">
            <Search size={18} />
          </span>

          <input
            type="text"
            className="sf-search-input-pill"
            placeholder="Search products in Sanam..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={handleOpenOverlay}
            onFocus={handleOpenOverlay}
            readOnly={false}
          />

          <div className="sf-search-actions">
            <button
              type="button"
              className="sf-cam-btn"
              onClick={handleOpenCam}
              title="Search by image / photo"
              aria-label="Search by image / photo"
            >
              <Camera size={18} />
            </button>

            <button
              type="submit"
              className="sf-search-submit-btn"
              aria-label="Search products"
            >
              <Search size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Instant Search Overlay */}
      <SearchOverlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        initialQuery={query}
      />

      {/* Direct Camera Visual Search Modal */}
      <ImageSearchModal
        isOpen={camModalOpen}
        onClose={() => setCamModalOpen(false)}
      />
    </>
  );
};

export default SearchBar;
