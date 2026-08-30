"use client";

import Offcanvas from "@/components/UI/Offcanvas";
import React, { useState } from "react";
import FilterSortBar from "./FilterSortBar";
import PriceRangeSlider from "./PriceRangeSlider/PriceRangeSlider";
import ProductsFilterContainer from "./ProductsFilterContainer/ProductsFilterContainer";
import { CiFilter } from "react-icons/ci";

const MobileFilterMenu = ({ productsData, categoryPage = false }) => {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  return (
    <div className="position-relative mobileFilterMenu">
      <button
        onClick={toggleOffcanvas}
        className="d-flex align-items-center gap-1"
      >
        <CiFilter /> Filter
      </button>

      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={toggleOffcanvas}
        title="Filter & Sort Products"
      >
        {categoryPage && <FilterSortBar />}
        <PriceRangeSlider productsData={productsData} />
        <ProductsFilterContainer productsData={productsData} />
      </Offcanvas>
    </div>
  );
};

export default MobileFilterMenu;
