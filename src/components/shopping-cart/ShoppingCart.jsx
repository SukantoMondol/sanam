"use client";

import { Trash2 } from "lucide-react";
import useCart from "@/hooks/useCart";
import ImageComponent from "../UI/Cards/ImageComponent";
import Link from "next/link";
import { useEffect, useRef } from "react";
import EmptyCart from "../EmptyCart/EmptyCart";
import Loading from "../Pages/Loading";
import {
  trackBeginCheckout,
  trackClearCart,
  trackRemoveFromCart,
  trackViewCart,
} from "@/utils/ga4Ecommerce";

export default function ShoppingCart() {
  const { cart, loading, updateCart, removeFromCart, clearCart, fetchCart } =
    useCart();
  const viewCartSignatureRef = useRef("");

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = (id, variationId, quantity, increment) => {
    let updatedData = { id, variationId };
    if (increment) {
      updatedData.quantity = quantity + 1;
    } else {
      updatedData.quantity = quantity - 1;
    }
    updateCart(updatedData);
  };

  useEffect(() => {
    if (!cart?.cart?.length) return;

    const signature = cart.cart
      .map((item) => `${item?.id}:${item?.quantity}:${item?.payable_price}`)
      .join("|");

    if (viewCartSignatureRef.current === signature) return;

    viewCartSignatureRef.current = signature;
    trackViewCart(cart);
  }, [cart]);

  const removeItem = (id) => {
    const item = cart?.cart?.find((cartItem) => cartItem?.id === id);
    if (item) {
      trackRemoveFromCart(item);
    }
    removeFromCart(id);
  };

  const clearAllItems = () => {
    trackClearCart(cart);
    clearCart();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {loading === false && (
        <>
          {cart?.cart?.length ? (
            <div className="container py-4 cart-page">
              <div className="card border-0 p-3 mb-lg-5 bg-white rounded-4">
                <div className="card-body p-0">
                  {/* HEADER */}
                  <div className="d-flex justify-content-between align-items-center mb-lg-4 mb-3">
                    <div className="flex-grow-1 text-center">
                      <h1 className="fs-5 card-title text-purple pb-lg-4 pb-3 border-bottom mb-0">
                        My Cart
                      </h1>
                    </div>
                  </div>
                  <div className="pb-lg-4 pb-3 d-flex justify-content-between align-items-center gap-lg-4 gap-3 flex-column flex-sm-row">
                    <h6 className="text-center text-sm-start">
                      All Listed Products
                    </h6>
                    <button
                      className="btn btn-link text-decoration-none text-purple border-gray px-5 py-2"
                      onClick={clearAllItems}
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle">
                      <thead>
                        <tr className="text-secondary text-center">
                          <th>Image</th>
                          <th>Products</th>
                          <th>Attribute</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Remove</th>
                        </tr>
                      </thead>

                      <tbody>
                        {cart?.cart?.map((item) => (
                          <tr key={item?.id}>
                            <td className="py-3">
                              <div className="bg-light size-60">
                                <ImageComponent
                                  src={item?.photo}
                                  alt={item?.product_name}
                                />
                              </div>
                            </td>

                            <td className="min-width-200">
                              {item?.product_name}
                            </td>

                            <td className="min-width-100">
                              {item?.product_attributes?.length > 0
                                ? item?.product_attributes?.map(
                                    (attribute, index) => (
                                      <p key={index}>
                                        {attribute?.name}: {attribute?.value}
                                      </p>
                                    )
                                  )
                                : "N/A"}
                            </td>
                            <td className="min-width-100">
                              {(Number(item?.payable_price) || 0).toFixed(3)} KWD
                            </td>

                            <td className="min-width-100">
                              <div className="btn-group">
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() =>
                                    updateQuantity(
                                      item?.id,
                                      item?.variation_id,
                                      item?.quantity,
                                      false
                                    )
                                  }
                                >
                                  -
                                </button>
                                <button className="btn btn-outline-secondary btn-sm disabled">
                                  {item?.quantity}
                                </button>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() =>
                                    updateQuantity(
                                      item?.id,
                                      item?.variation_id,
                                      item?.quantity,
                                      true
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="min-width-100">
                              {(Number(item?.payable_price * item?.quantity) || 0).toFixed(3)} KWD
                            </td>

                            <td className="min-width-100">
                              <button
                                className="btn btn-link text-secondary p-0"
                                onClick={() => removeItem(item?.id)}
                              >
                                <Trash2 />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-12 d-flex justify-content-end mb-lg-5 mb-3">
                    <div className="col-12 col-sm-8 col-md-6 col-lg-4 ">
                      <div className="cart-total p-3 p-lg-4 rounded mt-lg-4 fw-medium fs-lg-4">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Sub Total:</span>
                          <span>{(Number(cart?.summary?.sub_total) || 0).toFixed(3)} KWD</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Grand Total:</span>
                          <span>{(Number(cart?.summary?.total) || 0).toFixed(3)} KWD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 d-flex justify-content-end mt-3">
                    <div className="col-md-3 col-12 col-sm-8 col-md-6 col-lg-4">
                      <Link href={"/checkout"}>
                        <button
                          className="checkout-btn border-purple text-dark px-5 py-2 w-100 fw-medium fs-lg-4"
                          onClick={() => {
                            // begin_checkout event
                            if (typeof window !== "undefined") {
                              // Generate and store eventId for deduplication with Checkout page
                              const checkoutEventId = `begincheckout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                              sessionStorage.setItem('checkout_event_id', checkoutEventId);
                              sessionStorage.setItem('checkout_event_time', Date.now().toString());

                              trackBeginCheckout(cart);

                              console.log('begin_checkout pushed from ShoppingCart with eventId:', checkoutEventId);
                            }
                          }}
                        >
                          Checkout
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyCart />
          )}
        </>
      )}
    </>
  );
}
