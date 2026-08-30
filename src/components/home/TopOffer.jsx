import React from "react";
import Image from "next/image";
import ArrowSVG from "@/assets/images/top-arrow.svg";

const TopOffer = () => {
  return (
    <div className="bg-purple d-flex align-items-center text-white py-2">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center py-3">
        {/* Left Section */}
        <div className="d-flex align-items-center gap-2 mb-2 mb-md-0 ">
          <h4 className="mb-0 fs-6 text-center text-md-start">UP TO 70% OFF & FREE SHIPPING* | SHOP CYBER WEEK DEALS</h4>
          <Image src={ArrowSVG} width={14} height={14} alt="Arrow" className="translate-middle-ny" />
        </div>

        {/* Right Section */}
        <h4 className="mb-0 fs-6 text-center text-md-end ">Rewards | Financing | Professional | Free & Easy Delivery Over $35*</h4>
      </div>
    </div>
  );
};

export default TopOffer;
