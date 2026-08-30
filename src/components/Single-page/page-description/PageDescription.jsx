"use client";

import { useState } from "react";

export default function pageDescription() {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="container p-0 mt-100 mb-100">
      {/* Navigation Tabs */}
      <ul className="mb-6 nav nav-tabs justify-content-between border-0" role="tablist">
        <li className="nav-item w-25 " role="presentation">
          <button
            className={` w-100  p-4 border-0 tab-btn rounded-0 ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
        </li>
        <li className="nav-item w-25" role="presentation">
          <button
            className={`tab-btn  border-0 p-4 w-100 rounded-0 ${activeTab === "specification" ? "active" : ""}`}
            onClick={() => setActiveTab("specification")}
          >
            Product Specification
          </button>
        </li>
        <li className="nav-item w-25" role="presentation">
          <button
            className={`tab-btn  border-0 p-4 w-100 rounded-0 ${activeTab === "delivery" ? "active" : ""}`}
            onClick={() => setActiveTab("delivery")}
          >
            Delivery & Return Policy
          </button>
        </li>
        <li className="nav-item w-25" role="presentation">
          <button
            className={`tab-btn  border-0 p-4 w-100 rounded-0 ${activeTab === "review" ? "active" : ""}`}
            onClick={() => setActiveTab("review")}
          >
            Review
          </button>
        </li>
      </ul>

      {/* Content */}
      <div className="tab-content px-4 py-0 mt-50">
        {activeTab === "description" && (
          <div>
            <h5 className="mb-3  fs-4 fw-semibold">About This Product</h5>
            <p className="mb-4 fs-5">
              The world famous Peshki adds a unique touch to your bathroom decor. Each towel features a ribbed texture along the entire face the towel
              which increases absorbency and soft texture. The Peshki is perfect for those who like strong, durable towels rather than soft, plush
              towels. The ribbed texture provides superior scrubbing which means the Peshki is perfect for families with young children.
            </p>

            <h5 className="mb-3 mt-4">Features</h5>
            <ul className="list-unstyled list-item-font-size ">
              <li className="mb-40">
                • Soft and pamper yourself with these ultra-soft, extra plush, large hotel and spa-quality towels. Bright optical colors will bring
                class and elegance to any room. Beautifully designed and woven in a secured ribbed style.
              </li>
              <li className="mb-40">
                • Made with 100% Turkish cotton. Doubled stitched to prevent fraying and promote longevity and durability. These towel sets are the
                same quality towels are found in high-end spas and 5-star hotels around the world.
              </li>
              <li className="mb-40">
                • Made with no chemical processing, making it safe for babies, children, and all guests. For best results machine wash warm twice
                before using. Linting may occur but will dissipate after the first few washes. If you notice your towel "moving the water but not
                absorbing it" please wash once more to activate the combed Turkish fibers.
              </li>
              <li className="mb-40">
                • This combed cotton towel is hefty and ultra plush for extra softness and comfort. Wrap your hands in this 40" x 65" inch bath sheet
                and ensure maximum absorbency.
              </li>
            </ul>
          </div>
        )}

        {activeTab === "specification" && (
          <div>
            <p>Product specification content goes here...</p>
          </div>
        )}

        {activeTab === "delivery" && (
          <div>
            <p>Delivery and return policy content goes here...</p>
          </div>
        )}

        {activeTab === "review" && (
          <div>
            <p>Product reviews goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
}
