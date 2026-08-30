"use client";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import OrderTable from "@/components/Payment/OrderTable";
import Loader from "@/components/UI/Shared/Loader";
import {
  trackPaymentInitiated,
  trackPaymentComplete,
} from "@/utils/ga4Ecommerce";

const Payment = ({ params }) => {
  const [payment, setPayment] = useState({});
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();

  const paymentBaseUrl = process.env.NEXT_PUBLIC_PAYMENT_URL?.replace(/\/$/, "");
  const getPaymentUrl = (onlyDeliveryCharge) =>
    `${paymentBaseUrl}/pay?invoice_no=${encodeURIComponent(
      params
    )}&only_delivery_charge=${onlyDeliveryCharge ? 1 : 0}`;

  const paymentList = async () => {
    setLoader(true);
    setErrorMessage("");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/get-order-payment/${params}`
      );
      setPayment(response.data?.data);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.status_message ||
          "Unable to load the order payment information. Please try again."
      );
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (params) {
      paymentList();
    }
  }, [params]);

  // ── payment_complete: fires when bKash / SSLCommerz redirects back ──────
  // The payment gateway appends ?payment_status=success to the redirect URL.
  useEffect(() => {
    const status = searchParams.get("payment_status");
    const invoiceNo = searchParams.get("invoice_no") || params;
    const paymentMethod = searchParams.get("payment_method") || "online";

    if (status === "success") {
      trackPaymentComplete({
        invoiceNo,
        value: payment?.total_payable_amount || 0,
        shipping: payment?.shipping_charge || 0,
        discount: payment?.total_discount_amount || 0,
        paymentMethod,
        currency: "KWD",
      });
    }
  }, [searchParams, payment]);
  // ─────────────────────────────────────────────────────────────────────────

  // Handler: fires payment_initiated before navigating to payment gateway
  const handlePaymentClick = (e, onlyDeliveryCharge) => {
    // ── Fire "payment_initiated" event ──────────────────────────────────────
    trackPaymentInitiated({
      invoiceNo: params,
      value: onlyDeliveryCharge
        ? payment?.shipping_charge || 0
        : payment?.total_payable_amount || 0,
      paymentMethod: "online",
      currency: "KWD",
    });
    // ─────────────────────────────────────────────────────────────────────
    // Navigation happens via the <a> href — no need to do anything else here
  };

  if (loader) return <Loader />;

  if (errorMessage) {
    return (
      <div className="paymentglobalPadding marginTop-conditional mb-4">
        <div className="container shadow p-4 rounded text-center">
          <p className="text-danger mb-0">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`paymentglobalPadding  marginTop-conditional  mb-4`}>
      <div className="container shadow p-3 rounded">
        <h1 className="rounded fs-3 pt-0 mb-2 text-center order-now-page-title">
          Payment Now
        </h1>
        <div className="">
          <OrderTable orderDetails={payment} id={0} />
          <div>
            <div className={"container"}>
              <div className={"row"}>
                <div className="col-md-6 col-lg-6 col-xl-7 text-md-start">
                  <h2 className="order-now-page-title mb-2">
                    Shipping Information
                  </h2>
                  <p className="my-0">Name</p>
                  <p
                    className="fw-bolder mt-0 my-0"
                    style={{ color: "#696969" }}
                  >
                    {payment?.customer_name}
                  </p>
                  <p className="my-0">Phone</p>
                  <p
                    className="fw-bolder mt-0 my-0"
                    style={{ color: "#696969" }}
                  >
                    {payment?.shipping_address?.phone}
                  </p>
                  <p className="my-0">Address</p>
                  <p
                    className="fw-bolder mt-0 mb-0"
                    style={{ color: "#696969" }}
                  >
                    {payment?.shipping_address?.street_address}
                  </p>
                </div>
                <div
                  sm={12}
                  md={6}
                  lg={6}
                  xl={5}
                  className={"col-12 col-md-6 col-lg-6 col-xl-5"}
                >
                  <div className={`cartDetails mt-3 p-2`}>
                    <div className="d-flex justify-content-between fw-bold px-3 p-1 m-0">
                      <div>Sub-Total:</div>
                      <div>KD {payment?.total_amount}</div>
                    </div>
                    <div className="d-flex justify-content-between fw-bold px-3 p-1 m-0">
                      <div>Shipping Charge:</div>
                      <div>KD {payment?.shipping_charge}</div>
                    </div>
                    {payment?.total_discount_amount > 0 && (
                      <div className="d-flex justify-content-between fw-bold px-3 p-1 m-0">
                        <div>Discount:</div>
                        <div>KD {payment?.total_discount_amount}</div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between fw-bold px-3 p-1 m-0">
                      <div>Grand Total:</div>
                      <div>KD {payment?.total_payable_amount}</div>
                    </div>
                  </div>
                  <div className={` mt-3 d-flex gap-2 w-100`}>
                    {payment.shipping_charge > 0 &&
                    payment.total_paid_amount == 0 &&
                    !payment.dont_allow_to_pay_delivery_charge ? (
                      <a
                        href={getPaymentUrl(true)}
                        className="btn btnDiv w-100 bg-white px-4 py-2 text-purple border-1 border-purple rounded-5"
                        style={{ fontSize: "14px" }}
                        onClick={(e) => handlePaymentClick(e, true)}
                      >
                        Pay Delivery Charge KD {payment?.shipping_charge}
                      </a>
                    ) : null}

                    {payment.total_payable_amount > 0 &&
                    !payment.dont_allow_to_pay_full_charge ? (
                      <a
                        href={getPaymentUrl(false)}
                        className="btn btnDiv w-100 bg-purple px-4 py-2 text-white border-0 rounded-5"
                        style={{ fontSize: "14px" }}
                        onClick={(e) => handlePaymentClick(e, false)}
                      >
                        Pay Full Payment KD {payment?.total_payable_amount}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

