"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Info } from "lucide-react";
import FabricConfigurator from "../fabric-configurator/FabricConfigurator";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);

  const thumbnails = Array(8).fill(
    "/assets/images/products/single-product-main.png"
  );

  return (
    <div className="container p-4 ">
      <div className="row">
        <div className="col-12 mb-4">
          <p className="product-breadcrumb">
            Bed & Bath / Bath Rugs & Towels / All Bath Towels / SKU: Woo5933130
          </p>
        </div>

        <div className="col-12 col-lg-7">
          <div className="d-flex flex-col flex-md-row-reverse gap-4">
            {/* Main Image */}
            <div className="w-full position-relative">
              <button className="position-absolute top-50 start-0 translate-middle-y bg-white rounded-circle p-2 shadow-sm border-0">
                <ChevronLeft className="text-purple" size={24} />
              </button>
              <Image
                src="/assets/images/products/single-product-main.png"
                alt="Product main image"
                width={800}
                height={800}
                className="w-100 h-auto"
              />
              <button className="position-absolute top-50 end-0 translate-middle-y bg-white rounded-circle p-2 shadow-sm border-0">
                <ChevronRight className="text-purple" size={24} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="w-full overflow-hidden">
              <div className="d-flex flex-row flex-lg-column gap-2">
                {thumbnails.map((thumb, i) => (
                  <div
                    key={i}
                    className="border rounded p-1 cursor-pointer hover:border-purple thumb-size"
                  >
                    <Image
                      src={thumb || "/placeholder.svg"}
                      alt={`Thumbnail ${i + 1}`}
                      width={70}
                      height={70}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {thumbnails.length > 8 && (
                  <div className="border rounded p-2 text-center bg-gray">
                    +{thumbnails.length - 8} more
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-12 col-lg-5">
          <h1 className="fs-4 fw-medium mb-3">
            Fralick 100% Cotton Ribbed Bath Towels (Set of 3)
          </h1>
          <div className="mb-3 fs-5">
            <span>See More by </span>
            <a href="#" className="text-purple text-decoration-none">
              Gracie Oaks
            </a>
          </div>

          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="fs-4 mb-0">5.0</span>
            <div className="fs-4 text-purple">{"★".repeat(5)}</div>
            <span className="text-muted">(190 Reviews)</span>
          </div>

          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="font-32 fw-bold text-purple mb-0">KD 57.99</span>
            <span className=" font-32 fw-normal text-muted text-decoration-line-through">
              KD 71.99
            </span>
            <span className="badge fs-6 fw-medium bg-white text-purple border-purple rounded-1">
              10% OFF
            </span>
          </div>

          <FabricConfigurator />

          <div className="text-muted mb-3">Sold in Set of 3</div>

          {/* Quantity and Add to Cart */}
          <div className="d-flex gap-3">
            <div className="d-flex align-items-center border-0 w-25">
              <button
                className="btn btn-light px-3 py-2 rounded-start-pill border-1 border-purple"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={16} />
              </button>
              <input
                type="text"
                className="form-control text-center py-2 px-3 border-1 border-purple rounded-0 w-25"
                value={quantity}
                readOnly
              />
              <button
                className="btn btn-light px-3 py-2 rounded-end-pill border-1 border-purple"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
            <button className="btn btn-purple flex-grow-1 btn-purple py-3 rounded-pill">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
