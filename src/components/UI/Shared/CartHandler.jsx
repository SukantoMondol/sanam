"use client";
import React from "react";
import AddToCartButton from "@/components/UI/Shared/AddToCartButton";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

const CartHandler = ({ product }) => {
  const router = useRouter();
  const handleBuyNow = async () => {
    const payablePrice = Number(product?.price?.payable_price) || Number(product?.payable_price) || Number(product?.price) || 0;
    const origPrice = Number(product?.price?.price) || Number(product?.old_price) || payablePrice;

    localStorage.setItem(
      "buy_now",
      JSON.stringify({
        slug: product?.slug || product?.id,
        quantity: 1,
        product: {
          id: product?.id,
          name: product?.name || product?.title,
          title: product?.name || product?.title,
          slug: product?.slug || product?.id,
          photo: product?.photo || product?.image,
          price: {
            payable_price: payablePrice,
            price: origPrice,
          },
          payable_price: payablePrice,
          retail_price: payablePrice,
          quantity: 1,
        },
      })
    );

    router.push("/buy-now");
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
