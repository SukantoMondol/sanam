"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import liveCategories from "@/data/liveCategories.json";

const DEFAULT_CATEGORIES = liveCategories || [];

const SanamMegaMenu = ({ categories = [], onClose }) => {
  // "featured" or numeric category id
  const [activeTab, setActiveTab] = useState("featured");

  // Always use live categories or bundled 24 categories
  const categoryList = useMemo(() => {
    if (Array.isArray(categories) && categories.length >= 10) {
      return categories;
    }
    return DEFAULT_CATEGORIES;
  }, [categories]);

  // Compute what to show on the right grid
  let gridTitle = "All Categories";
  let gridLink = "/all-products";
  let gridItems = [];

  if (activeTab === "featured") {
    gridTitle = "All Categories";
    gridLink = "/all-products";
    // Show ALL 23 categories in the store with circular photos
    gridItems = categoryList.map((cat, idx) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      picture: cat.picture,
      isHot: idx < 8 || idx === 10 || idx === 12,
      type: "category",
    }));
  } else {
    const selectedCat = categoryList.find(
      (c) =>
        String(c.id) === String(activeTab) ||
        c.id === activeTab ||
        c.slug === activeTab ||
        (c.name && c.name.toLowerCase() === String(activeTab).toLowerCase())
    );

    if (selectedCat) {
      gridTitle = `All ${selectedCat.name} >`;
      gridLink = `/category/${selectedCat.slug}`;

      // 1. Subcategories with photos
      if (selectedCat.children && selectedCat.children.length > 0) {
        selectedCat.children.forEach((child, idx) => {
          gridItems.push({
            id: child.id,
            name: child.name,
            slug: child.slug || selectedCat.slug,
            picture: child.picture || selectedCat.picture,
            isHot: idx < 3,
            type: "subcategory",
          });
        });
      }

      // 2. Real products for this category
      if (selectedCat.products && selectedCat.products.length > 0) {
        selectedCat.products.forEach((prod, idx) => {
          const rawPrice =
            prod.retail_price ||
            prod.price?.payable_price ||
            prod.price?.price ||
            (typeof prod.price === "number" ? prod.price : null);

          gridItems.push({
            id: prod.id,
            name: prod.title || prod.name,
            slug: prod.slug || selectedCat.slug,
            picture: prod.image || prod.photo || prod.picture || selectedCat.picture,
            price: rawPrice ? `${rawPrice} KWD` : null,
            isHot: idx === 0 || idx === 1,
            type: "product",
          });
        });
      }

      // Fallback if no children/products
      if (gridItems.length === 0) {
        gridItems = [
          {
            id: selectedCat.id,
            name: selectedCat.name,
            slug: selectedCat.slug,
            picture: selectedCat.picture,
            isHot: true,
            type: "category",
          },
        ];
      }
    }
  }

  return (
    <div className="temu-mega-menu-wrapper">
      {/* Top pointer triangle */}
      <div className="temu-mega-menu-pointer" />

      <div className="temu-mega-menu">
        <div className="temu-mega-menu__inner">
          {/* Left Sidebar */}
          <div className="temu-mega-menu__sidebar">
            <div
              className={`temu-mega-menu__sidebar-item ${
                activeTab === "featured" ? "temu-mega-menu__sidebar-item--active" : ""
              }`}
              onMouseEnter={() => setActiveTab("featured")}
              onMouseOver={() => setActiveTab("featured")}
              onClick={() => setActiveTab("featured")}
            >
              <div className="temu-mega-menu__sidebar-link">
                <span>⭐ Featured</span>
                <span className="temu-mega-menu__arrow">›</span>
              </div>
            </div>

            {categoryList.map((cat) => {
              const isItemActive =
                String(activeTab) === String(cat.id) ||
                activeTab === cat.slug ||
                activeTab === cat.name;

              return (
                <div
                  key={cat.id}
                  className={`temu-mega-menu__sidebar-item ${
                    isItemActive ? "temu-mega-menu__sidebar-item--active" : ""
                  }`}
                  onMouseEnter={() => setActiveTab(cat.id)}
                  onMouseOver={() => setActiveTab(cat.id)}
                  onClick={() => setActiveTab(cat.id)}
                >
                  <div className="temu-mega-menu__sidebar-link">
                    <span className="text-truncate">{cat.name}</span>
                    <span className="temu-mega-menu__arrow">›</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Content - 5-column Image Grid */}
          <div className="temu-mega-menu__content">
            <div className="temu-mega-menu__content-header mb-3 d-flex align-items-center justify-content-between">
              <Link
                href={gridLink || "/all-products"}
                className="fw-bold text-dark mb-0 text-decoration-none d-flex align-items-center gap-1 temu-mega-title-link"
                onClick={onClose}
              >
                <span>{gridTitle}</span>
              </Link>
            </div>

            <div className="temu-mega-menu__grid">
              {gridItems.map((item, idx) => {
                const itemHref =
                  item.type === "product"
                    ? `/product-details/${item.slug}`
                    : `/category/${item.slug}`;

                return (
                  <Link
                    key={`${item.id}-${idx}`}
                    href={itemHref}
                    className="temu-mega-menu__grid-item"
                    onClick={onClose}
                  >
                    <div className="temu-mega-menu__img-wrapper">
                      {item.picture ? (
                        <img
                          src={item.picture}
                          alt={item.name}
                          className="temu-mega-menu__img"
                          loading="lazy"
                          suppressHydrationWarning
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.nextSibling) {
                              e.currentTarget.nextSibling.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="temu-mega-menu__img-placeholder"
                        style={{ display: item.picture ? "none" : "flex" }}
                      >
                        {item.name?.charAt(0) || "🏷️"}
                      </div>
                      {item.isHot && (
                        <span className="temu-mega-menu__hot-badge">HOT</span>
                      )}
                    </div>
                    <span className="temu-mega-menu__item-name text-truncate w-100">
                      {item.name}
                    </span>
                    {item.price && (
                      <span className="temu-mega-menu__item-price">
                        {item.price}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanamMegaMenu;
