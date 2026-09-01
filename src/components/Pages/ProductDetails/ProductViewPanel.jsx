"use client";

import { useEffect, useRef, useState } from "react";
import ProductImageSlider from "./ProductImageSlider";
import ProductVariants from "./ProductVariants";
import useCart from "@/hooks/useCart";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import ImageComponent from "@/components/UI/Cards/ImageComponent";
import Link from "next/link";

const ProductViewPanel = ({
  productDetailsData,
  isLandingPage,
  setActiveTab,
}) => {
  const searchParams = useSearchParams();
  const [selectedValues, setSelectedValues] = useState({}); // output: {Size: '40', Colour: 'BLUE'}
  const [isDefaultAttributeSelected, setIsDefaultAttributeSelected] =
    useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [price, setPrice] = useState(
    selectedVariation?.variation_price || productDetailsData?.product?.price
  );

  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // const [selectedImage, setSelectedImage] = useState(
  //   selectedVariation?.product_variation_photo ||
  //     productDetailsData?.product?.photos?.[0]
  // );
  const [selectedImage, setSelectedImage] = useState(
    productDetailsData?.product?.photos?.[0] || {
      id: productDetailsData?.product?.id,
      photo_full: productDetailsData?.product?.photo,
      photo_thumb: productDetailsData?.product?.photo,
      alt_text: productDetailsData?.product?.name,
    }
  );

  const currentImageIndex = productDetailsData?.product?.photos?.findIndex(
    (photo) => photo?.id === selectedImage?.id
  );

  useEffect(() => {
    if (!Array.isArray(productDetailsData?.product?.product_variations)) return;

    const matchingVariation =
      productDetailsData.product.product_variations.find((variation) =>
        Array.isArray(variation?.variation_attributes) &&
        variation.variation_attributes.every(
          (attribute) => selectedValues[attribute.name] === attribute.value
        )
      );

    if (matchingVariation) {
      // if (selectedImage?.id !== productDetailsData?.product?.id) {
      //   setSelectedImage(matchingVariation?.product_variation_photo);
      // }
      if (isDefaultAttributeSelected === false) {
        setSelectedImage(matchingVariation?.product_variation_photo);
      }

      setPrice(matchingVariation?.variation_price);
      setSelectedVariation(matchingVariation || null);
    }
  }, [selectedValues, productDetailsData, isDefaultAttributeSelected]);

  const cartData = {
    product_id: productDetailsData?.product?.id,
    product_name: productDetailsData?.product?.name || productDetailsData?.product?.title,
    photo: productDetailsData?.product?.photo || productDetailsData?.product?.photos?.[0]?.photo_full,
    payable_price: price?.payable_price || productDetailsData?.product?.price?.payable_price || productDetailsData?.product?.retail_price,
    price: price?.price || productDetailsData?.product?.price?.price,
    variation_id:
      productDetailsData?.product?.product_type === 2
        ? selectedVariation?.id
        : null,
    quantity: quantity || 1,
  };

  const handleAddToCart = async () => {
    addToCart(cartData);
  };

  const intervalId = useRef(null);
  useEffect(() => {
    if (isLandingPage) {
      // Show the first toast after 10 seconds
      const firstTimeout = setTimeout(() => {
        showToast();

        // Then start interval to show toast every 10 minutes
        intervalId.current = setInterval(() => {
          showToast();
        }, 10 * 60 * 1000); // 10 minutes
      }, 10 * 1000); // 10 seconds

      function showToast() {
        toast(
          <div className="d-flex align-items-center gap-3 px-1">
            <ImageComponent
              src={productDetailsData?.product?.photo}
              height={60}
              width={60}
              alt={productDetailsData?.product?.name}
              className="rounded"
            />
            <p>
              Someone bought the product
              <span
                style={{ fontSize: "14px" }}
                className="primary-color ms-1 text-decoration-underline"
              >
                {productDetailsData?.product?.name}
              </span>
            </p>
          </div>,
          {
            position: "bottom-left",
            hideProgressBar: true,
            pauseOnHover: false,
          }
        );
      }

      // Cleanup timers on unmount or dependency change
      return () => {
        clearTimeout(firstTimeout);
        if (intervalId.current) clearInterval(intervalId.current);
      };
    }
  }, []);

  return (
    <div className="productViewPanel">
      <div className="productViewRow">
        <ProductImageSlider
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          productDetailsData={productDetailsData}
          currentImageIndex={currentImageIndex}
        />

        {/* Product Details */}
        <div className="rounded-3 productDetailsPanel mt-0 mt-md-4 mt-lg-0">
          <h1>{productDetailsData?.product?.name}</h1>

          <div className="d-flex align-items-center gap-2 mt-4">
            <span className="h4 mb-0">
              {/* {productDetailsData?.product?.calculated_review
                  ?.average_review ?? 0} */}
              5.0/5
            </span>
            <div className="h4 mt-2 fs-4 text-purple">
              {/* {"★".repeat(
                  parseFloat(
                    productDetailsData?.product?.calculated_review
                      ?.average_review
                  ) ?? 0
                )} */}
              {"★".repeat(5)}
            </div>

            <Link
              href={`#product-reviews`}
              onClick={() => setActiveTab("review")}
            >
              {productDetailsData?.product.calculated_review
                ?.total_review_count > 0 && (
                  <span className="text-muted mb-1">
                    (
                    {
                      productDetailsData?.product?.calculated_review
                        ?.total_review_count
                    }{" "}
                    {productDetailsData?.product?.calculated_review
                      ?.total_review_count === 1
                      ? "Review"
                      : "Reviews"}
                    )
                  </span>
                )}
            </Link>
          </div>

          <ProductVariants
            isLandingPage={isLandingPage}
            quantity={quantity}
            setQuantity={setQuantity}
            price={price}
            productDetailsData={productDetailsData}
            selectedValues={selectedValues}
            setIsDefaultAttributeSelected={setIsDefaultAttributeSelected}
            setSelectedValues={setSelectedValues}
            handleAddToCart={handleAddToCart}
            stock={selectedVariation?.variation_inventory?.stock}
            selectedVariation={selectedVariation}
            initialVariationParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductViewPanel;
