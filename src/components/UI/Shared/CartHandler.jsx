"use client";
import React from "react";
import AddToCartButton from "@/components/UI/Shared/AddToCartButton";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

const CartHandler = ({ product }) => {
  const router = useRouter();
  const handleBuyNow = async () => {
    localStorage.setItem(
      "buy_now",
      JSON.stringify({ slug: product?.slug, quantity: 1 })
    );

    if (product?.product_type == 1) {
      try {
        await axiosInstance.post("/cart", {
          product_id: product?.id,
          variation_id: null,
          quantity: 1,
        });
      } catch (error) {
        // non-critical side effect; proceed to buy-now regardless
      }

      router.push("/buy-now");
    } else {
      router.push(`/product-details/${product?.slug}`);
    }
  };
  return (
    <>
      <div className="d-flex w-100 gap-1 mt-2">
        {product.disable_add_to_cart_button != 1 && (
          <AddToCartButton product={product} />
        )}
        <button
          onClick={handleBuyNow}
          className="temu-btn-order-now"
        >
          Order Now
        </button>
      </div>
    </>
  );
};

export default CartHandler;
