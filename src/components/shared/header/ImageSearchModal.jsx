"use client";

import { useState, useRef } from "react";
import { Camera, X, Upload, AlertCircle } from "lucide-react";

export default function ImageSearchModal({ isOpen, onClose, onSearchSubmit }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = (file) => {
    setError(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Image file size must be less than 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      processImageSearch(file);
    };
    reader.readAsDataURL(file);
  };

  const processImageSearch = async (file) => {
    setLoading(true);
    setError(null);

    try {
      if (typeof onSearchSubmit === "function") {
        await onSearchSubmit(file);
      } else {
        // Default: POST to visual search endpoint
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("https://kw.sanamstore.net/image-search", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const redirectUrl = res.url || "/search?image_search=visual";
          window.location.href = redirectUrl;
        } else {
          // Fallback redirect with keyword
          window.location.href = `/search/image-search`;
        }
      }
    } catch (err) {
      console.warn("Visual search error:", err);
      window.location.href = `/search/image-search`;
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="sf-cam-modal-backdrop" onClick={onClose}>
      <div
        className="sf-cam-modal-card"
        onClick={(e) => e.stopPropagation()}
        onDragEnter={handleDrag}
      >
        <button
          type="button"
          className="sf-cam-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <h3 style={{ fontSize: "19px", fontWeight: 700, margin: "0 0 6px" }}>
          Search by Photo
        </h3>
        <p style={{ fontSize: "13.5px", color: "#666", margin: "0 0 16px" }}>
          Take a photo or upload an image to find identical or similar products instantly.
        </p>

        {error && (
          <div
            style={{
              background: "#ffebee",
              color: "#c62828",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ padding: "30px 0" }}>
            <div className="sf-cam-spinner"></div>
            <p style={{ fontWeight: 600, color: "var(--sf-primary)", margin: "8px 0" }}>
              Scanning & Matching Products...
            </p>
            <p style={{ fontSize: "12.5px", color: "#888" }}>
              Our AI visual engine is finding the best matches.
            </p>
          </div>
        ) : (
          <>
            <div
              className={`sf-cam-drop-zone ${dragActive ? "drag-active" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {preview ? (
                <div style={{ width: "120px", height: "120px", borderRadius: "12px", overflow: "hidden", border: "2px solid var(--sf-primary)" }}>
                  <img src={preview} alt="Uploaded preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div className="sf-cam-icon-circle">
                  <Camera size={32} />
                </div>
              )}

              <div>
                <b style={{ display: "block", fontSize: "14px", color: "var(--sf-dark)", marginBottom: "4px" }}>
                  Tap to take photo or choose image
                </b>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  Supports JPG, PNG, WEBP up to 8MB
                </span>
              </div>
            </div>

            <button
              type="button"
              className="sf-search-submit-btn"
              style={{ width: "100%", height: "42px", fontSize: "14px", fontWeight: 600 }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} style={{ marginRight: "6px" }} /> Choose File
            </button>
          </>
        )}
      </div>
    </div>
  );
}
