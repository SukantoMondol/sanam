import { useEffect, useState } from "react";
import ImageComponent from "@/components/UI/Cards/ImageComponent";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaMinus, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { IoIosArrowDropright } from "react-icons/io";
import axiosInstance from "@/utils/axiosInstance";

const ProductVariants = ({
  isLandingPage,
  price,
  productDetailsData,
  selectedValues,
  setSelectedValues,
  setIsDefaultAttributeSelected,
  quantity,
  setQuantity,
  handleAddToCart,
  stock,
  selectedVariation,
  initialVariationParams,
}) => {
  const [activeSection, setActiveSection] = useState(null); // Holds the currently open accordion section
  const router = useRouter();
  // Default selection and opening the first accordion
  useEffect(() => {
    // DEBUG: Log incoming data and params
    // eslint-disable-next-line no-console
    console.log('DEBUG variations:', productDetailsData?.product?.product_variations_attribute_list);
    // eslint-disable-next-line no-console
    console.log('DEBUG initialVariationParams:', initialVariationParams ? Array.from(initialVariationParams.entries()) : null);
    const defaultSelection = {};
    const variations =
      Array.isArray(productDetailsData?.product?.product_variations_attribute_list)
        ? productDetailsData.product.product_variations_attribute_list
        : [];
    let urlParamOverrideApplied = false;

    const normalizedParams = {};
    if (initialVariationParams) {
      for (const [key, value] of initialVariationParams.entries()) {
        normalizedParams[key.toLowerCase()] =
          typeof value === "string"
            ? value.replace(/\+/g, " ")
            : value;
      }
    }

    if (variations.length > 0) {
      // Select the first value for each variation
      variations.forEach((variation) => {
        const values = Array.isArray(variation?.value) ? variation.value : [];
        if (values.length > 0) {
          defaultSelection[variation?.name] = values[0];
        }
      });

      // Override defaults with URL params (case-insensitive key and value match,
      // also handles spelling variants like "color" vs "colour")
      if (initialVariationParams) {
        variations.forEach((variation) => {
          const attrLower = variation?.name?.toLowerCase();
          let paramValue = normalizedParams[attrLower];

          // Fallback: iterate all params and check for shared prefix (≥4 chars)
          // e.g. matches "color" to "colour", "size" to "size"
          if (!paramValue) {
            for (const [key, value] of Object.entries(normalizedParams)) {
              const keyLower = key.toLowerCase();
              const prefixLen = 4;
              if (
                typeof attrLower === "string" &&
                typeof keyLower === "string" &&
                attrLower.length >= prefixLen &&
                keyLower.length >= prefixLen &&
                attrLower.substring(0, prefixLen) === keyLower.substring(0, prefixLen)
              ) {
                paramValue = value;
                break;
              }
            }
          }

          if (typeof paramValue === "string") {
            const values = Array.isArray(variation?.value) ? variation.value : [];
            const matched = values.find(
              (v) => v?.toLowerCase() === paramValue?.toLowerCase()
            );
            if (matched) {
              defaultSelection[variation?.name] = matched;
              urlParamOverrideApplied = true;
            }
          }
        });
      }

      // Set the first accordion section to open by default
      setActiveSection(variations[0]?.name);
    }

    setSelectedValues(defaultSelection);
    // If URL params overrode a default, treat as a manual selection so the
    // variation image updates accordingly
    setIsDefaultAttributeSelected(!urlParamOverrideApplied);
  }, [productDetailsData, initialVariationParams]);

  const handleBuyNow = async () => {
    localStorage.setItem(
      "buy_now",
      JSON.stringify({
        slug: productDetailsData?.product?.slug,
        quantity,
        variation_id: selectedVariation?.id,
      })
    );

    try {
      await axiosInstance.post("/cart", {
        product_id: productDetailsData?.product?.id,
        variation_id:
          productDetailsData?.product?.product_type === 2
            ? selectedVariation?.id
            : null,
        quantity,
      });
    } catch (error) {
      // non-critical side effect; proceed to buy-now regardless
    }

    router.push("/buy-now");
  };

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return "0.000 KWD";
    return `${Number(amount).toFixed(3)} KWD`;
  };

  return (
    <div className="productVariantsWrapper">
      <div className="priceSection d-flex align-items-center flex-wrap gap-2">
        <span className="text-purple fw-bold">{formatPrice(price?.payable_price)}</span>
        {price?.payable_price !== price?.price && (
          <span className="original-price fw-normal text-muted">
            {formatPrice(price?.price)}
          </span>
        )}

        {price?.discount_text && (
          <span className="badge bg-white text-secondary-color border-secondary-color rounded-1">
            {price?.discount_text}
          </span>
        )}
      </div>

      <div className="variationsAccordionWrapper border-danger">
        {productDetailsData?.product?.product_variations_attribute_list?.map(
          (productVariationsAttribute, index) => (
            <div className="accordion" id="configAccordion" key={index}>
              <div className="accordion-item border-0">
                <div className="accordion-header">
                  <button
                    aria-label={"toggle accordion"}
                    className={`accordion-button ${
                      isLandingPage && "py-2"
                    } bg-white ${
                      activeSection === productVariationsAttribute?.name
                        ? ""
                        : "collapsed"
                    }`}
                    onClick={() =>
                      setActiveSection(
                        activeSection === productVariationsAttribute?.name
                          ? null // Collapse if already active
                          : productVariationsAttribute?.name // Expand otherwise
                      )
                    }
                  >
                    <div className="d-flex align-items-center gap-3">
                      <ImageComponent
                        src="/assets/images/single-product/configurator-icon.png"
                        alt="Fabric icon"
                        width={isLandingPage ? 29 : 50}
                        height={isLandingPage ? 29 : 50}
                        className="rounded-0"
                      />
                      <div>
                        <div className="fw-medium">
                          {productVariationsAttribute?.name}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                <div
                  className={`accordion-collapse collapse ${
                    activeSection === productVariationsAttribute?.name
                      ? "show"
                      : ""
                  }`}
                >
                  <div className="accordion-body configurator-options-body d-flex flex-wrap gap-1 gap-lg-3">
                    {(Array.isArray(productVariationsAttribute?.value)
                      ? productVariationsAttribute.value
                      : []
                    ).map((value, index) => (
                      <button
                        aria-label={"select variation"}
                        key={index}
                        onClick={() => {
                          setSelectedValues({
                            ...selectedValues,
                            [productVariationsAttribute.name]: value,
                          });
                          setIsDefaultAttributeSelected(false);
                        }}
                        className={` ${
                          selectedValues[productVariationsAttribute?.name] ===
                          value
                            ? "selected"
                            : ""
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Quantity and Add to Cart */}
      <div
        className={`quantityAndCartSection d-flex flex-column mx-auto gap-4 flex-wrap flex-sm-nowrap mt-4 w-60`}
      >
        <div>
          <label
            htmlFor="quantity-value"
            className="d-block text-center mt-0 mb-1 fs-5"
          >
            Quantity
          </label>

          <div className="quantity-wrapper d-flex align-items-center">
            <button
              // className={`${isLandingPage && "flex-grow-1"}`}
              className="flex-grow-1"
              aria-label={"decrease quantity"}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <FaMinus />
            </button>
            <input
              // className={`${isLandingPage && "flex-grow-1"}`}
              className="flex-grow-1"
              type="text"
              id={"quantity-value"}
              value={quantity}
              readOnly
            />
            <button
              // className={`${isLandingPage && "flex-grow-1"}`}
              className="flex-grow-1"
              aria-label={"increase quantity"}
              onClick={() => setQuantity(quantity + 1)}
            >
              <FaPlus />
            </button>
          </div>
        </div>

        <div className={`product-actions d-flex flex-column gap-4 w-100`}>
          {/* <div className={isLandingPage ? "order-btn" : ""}> */}
          <div className={"order-btn"}>
            <button
              disabled={stock === 0}
              className="border-0"
              onClick={handleBuyNow}
            >
              <Image
                src={"/assets/images/icons/shopping-cart.png"}
                alt={""}
                width={24}
                height={24}
                className="me-2"
              />
              Order Now
            </button>
          </div>

          <div className={`d-flex gap-4 w-100`}>
            {!isLandingPage && (
              <>
                {productDetailsData.product.disable_add_to_cart_button != 1 && (
                  <button
                    disabled={stock === 0}
                    className="bg-white text-purple border-1 border-purple rounded-5 product-action-button d-flex align-items-center justify-content-between"
                    onClick={() => handleAddToCart()}
                  >
                    <IoIosArrowDropright size={32} />
                    <span>Add to Cart</span>
                    <IoIosArrowDropright size={32} />
                  </button>
                )}
              </>
            )}

            {isLandingPage && (
              <Link
                className="product-action-button rounded-pill d-flex align-items-center justify-content-between"
                href={`/product-details/${productDetailsData?.product?.slug}`}
              >
                <IoIosArrowDropright size={32} />
                <span>More Info</span>
                <IoIosArrowDropright size={32} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;
