"use client";

import { useState } from "react";
import ProductDescription from "./ProductDescription";
import ProductViewPanel from "./ProductViewPanel";

const ProductMainContent = ({ productDetailsData }) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <>
      <ProductViewPanel
        productDetailsData={productDetailsData}
        isLandingPage={false}
        setActiveTab={setActiveTab}
      />
      <ProductDescription
        productDetailsData={productDetailsData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
};

export default ProductMainContent;
