"use client";

import useCart from "@/hooks/useCart";
import { useRouter } from "next/navigation";

const AddToCartButton = ({ product }) => {
  const { addToCart } = useCart();
  const router = useRouter();

  const cartData = {
    product_id: product?.id,
    variation_id: product?.product_type === 2 ? product?.product_type : null,
    quantity: 1,
  };

  const redirectAfterTracking = (href) => {
    window.setTimeout(() => {
      router.push(href);
    }, 0);
  };

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("Listing Add to Cart clicked:", {
      productId: product?.id,
      productName: product?.name,
      productType: product?.product_type,
    });

    if (product.product_type == 2) {
      redirectAfterTracking(`/product-details/${product.slug}`);
      return false;
    }

    await addToCart(cartData);
  };

  return (
    <button
      className="temu-btn-add-to-cart"
      type="button"
      disabled={product?.inventory?.stock === 0}
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
