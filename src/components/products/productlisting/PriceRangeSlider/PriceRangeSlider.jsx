"use client";

import useDebounce from "@/utils/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";

const PriceRangeSlider = ({ productsData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const uniqueId = useId();

  const [selectedPrice, setSelectedPrice] = useState(
    productsData?.filters?.max_price
  );

  const debouncedSelectedPrice = useDebounce(selectedPrice);

  useEffect(() => {
    // Extract existing query parameters from the URL and convert them into an object
    const extractedParams = Object.fromEntries(
      new URLSearchParams(searchParams.toString()).entries()
    );

    const queryParams = new URLSearchParams();
    const paramsToSet = {
      page: extractedParams?.page,
      max_price: debouncedSelectedPrice
        ? debouncedSelectedPrice
        : extractedParams?.max_price,
      min_price: 1,
      per_page: extractedParams?.per_page,
      attribute: extractedParams?.attribute,
    };

    // Loop through the object and set query params dynamically, avoiding null values
    Object.entries(paramsToSet).forEach(([key, value]) => {
      if (value) queryParams.set(key, value);
    });

    // Update the URL with the new query parameters while ensuring the correct format
    router.push(`${pathName}?${decodeURIComponent(queryParams.toString())}`);
  }, [debouncedSelectedPrice]);

  return (
    <form className="priceRangeSlider mb-5">
      <div className="d-flex justify-content-between gap-4">
        <label htmlFor={`maxPrice-${uniqueId}`} className="fw-medium">
          Price
        </label>
        <button
          onClick={() => setSelectedPrice(productsData?.filters?.max_price)}
          type="reset"
        >
          Clear All
        </button>
      </div>

      <input
        type="range"
        id={`maxPrice-${uniqueId}`}
        name="volume"
        min="0"
        step="1"
        max={productsData?.filters?.max_price}
        defaultValue={productsData?.filters?.max_price}
        onChange={(event) => setSelectedPrice(event.target.value)}
      />

      <div className="d-flex justify-content-between gap-4">
        <p>0</p>
        <p>{selectedPrice}</p>
        <p>{productsData?.filters?.max_price}</p>
      </div>
    </form>
  );
};

export default PriceRangeSlider;
