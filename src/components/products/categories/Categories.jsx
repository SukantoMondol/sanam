"use client";

import ImageComponent from "@/components/UI/Cards/ImageComponent";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Categories() {
  return (
    <div className="container px-0">
      {/* Header */}
      <div className="d-flex align-items-center bg-white position-sticky top-0 z-3 px-3 py-2 border-bottom">
        <Link
          href="#"
          className="text-dark text-decoration-none d-flex align-items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="fw-medium">Furniture</span>
        </Link>
      </div>

      {/* View All Link */}
      <div className="px-3 py-2 d-flex align-items-center px-3 py-2 gap-3">
        <h1>Dining Chairs</h1>
        <Link href="#" className="text-secondary  small">
          View 273 items
        </Link>
      </div>

      {/* Gallery */}
      <div className="px-3">
        <div
          className="row row-cols-1 row-cols-sm-2  row-cols-md-3 row-cols-lg-6 g-3 pb-3"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {[
            {
              src: "/assets/images/Categories/f-1.png",
              alt: "Wooden cross-back dining chair",
            },
            {
              src: "/assets/images/Categories/f-2.png",
              alt: "Upholstered dining chair",
            },
            {
              src: "/assets/images/Categories/f-3.png",
              alt: "Leather barrel chair",
            },
            {
              src: "/assets/images/Categories/f-4.png",
              alt: "Rattan dining chair",
            },
            {
              src: "/assets/images/Categories/f-5.png",
              alt: "Modern leather dining chair",
            },
            {
              src: "/assets/images/Categories/f-6.png",
              alt: "High-back upholstered chair",
            },
          ].map((item, index) => (
            <div key={index} className="col scroll-snap-start ">
              <div className="card border-0 rounded-4 overflow-hidden">
                <div className="position-relative product-category-image">
                  <ImageComponent
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt}
                    // fill
                    className="object-fit-cover"
                    sizes="(max-width: 768px) 66vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
