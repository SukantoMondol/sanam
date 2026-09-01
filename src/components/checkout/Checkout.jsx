"use client";

import ImageComponent from "../UI/Cards/ImageComponent";
import { Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "@/utils/axiosInstance";
import AllAddresses from "./AllAddresses";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useCart from "@/hooks/useCart";
import AddNewAddress from "./AddNewAddress";
import UpdateAddress from "./UpdateAddress";
import EmptyCart from "../EmptyCart/EmptyCart";
import Loading from "../Pages/Loading";
import { getGoogleAnalyticsTrackingData } from "@/utils/gaTracking";
import { getCookie } from "cookies-next";
import {
  trackAddPaymentInfo,
  trackAddShippingInfo,
  trackPurchase,
  trackSingleProductBeginCheckout,
  trackSingleProductPurchase,
} from "@/utils/ga4Ecommerce";

import liveKuwaitAreas from "@/data/liveKuwaitAreas.json";

export default function Checkout({ mode = "cart" }) {
  const isBuyNow = mode === "buyNow";
  const router = useRouter();

  const { fetchCart, cart, loading, updateCart, removeFromCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD or MF
  const [shippingMethod, setShippingMethod] = useState(1);
  const [loader, setLoader] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kuwait Address & Customer State (Matches kw.sanamstore.net)
  const [guestInput, setGuestInput] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    phone_prefix: "965",
    country: "Kuwait",
    area: "",
    block: "",
    street: "",
    avenue: "",
    building: "",
    floor: "",
    unit: "",
    paci: "",
    create_account: false,
  });

  const [guestErrors, setGuestErrors] = useState({});
  const [areasList, setAreasList] = useState(liveKuwaitAreas || []);

  // Modals for logged-in users
  const [showAllAddressesModal, setShowAllAddressesModal] = useState(false);
  const [addNewAddressModal, setShowUpdate] = useState(false);
  const [updateAddressId, setUpdateAddressId] = useState(null);
  const [updateAddressModal, setShowUpdateAddress] = useState(false);
  const [allAddressesData, setAllAddressesData] = useState([]);

  // --- Buy Now (single product) state ---
  const [buyNowData, setBuyNowData] = useState(null);
  const [productDetailsData, setProductDetailsData] = useState({});
  const [buyNowLoading, setBuyNowLoading] = useState(true);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // --- Fraud & Security Blocked State ---
  const [blockedInfo, setBlockedInfo] = useState({
    isBlocked: false,
    remainingMinutes: 0,
    remainingSeconds: 0,
    blockedUntil: null,
    message: "",
  });

  // Fetch Kuwait Areas from API
  useEffect(() => {
    axiosInstance
      .get("/areas")
      .then((res) => {
        if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setAreasList(res.data.data);
        }
      })
      .catch(() => {
        setAreasList(liveKuwaitAreas || []);
      });
  }, []);

  const checkBlockStatus = async (phone = "") => {
    try {
      const res = await axiosInstance.get("/check-block-status", {
        params: phone ? { phone } : {},
      });
      if (res?.data?.is_blocked) {
        const mins = res?.data?.remaining_minutes || 1;
        const secs = res?.data?.remaining_seconds || mins * 60;
        setBlockedInfo({
          isBlocked: true,
          remainingMinutes: mins,
          remainingSeconds: secs,
          blockedUntil: res?.data?.blocked_until || null,
          message:
            res?.data?.message ||
            res?.data?.status_message ||
            `You are temporarily blocked from placing orders. Please try again after ${mins} minutes.`,
        });
      } else {
        setBlockedInfo((prev) => ({
          ...prev,
          isBlocked: false,
          remainingMinutes: 0,
          remainingSeconds: 0,
        }));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    checkBlockStatus();
  }, []);

  const fetchAllAddressesData = async () => {
    if (!getCookie("token")) return;
    try {
      const response = await axiosInstance.get(`/all-addresses`);
      if (response?.data?.status) {
        setAllAddressesData(response?.data?.data?.addresses || []);
      }
    } catch {
      // ignore
    }
  };

  const fetchProfileData = async () => {
    if (!getCookie("token")) return;
    try {
      const response = await axiosInstance.get(`/profile-view`);
      if (response?.data?.status) {
        setProfileData(response?.data?.data?.profile || {});
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setIsLoggedIn(Boolean(getCookie("token")));
    fetchAllAddressesData();
    fetchProfileData();
    fetchCart();
  }, []);

  // --- Buy Now: read localStorage and fetch single product ---
  useEffect(() => {
    if (!isBuyNow) return;
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("buy_now");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBuyNowData(parsed);

        if (parsed?.product && parsed.product.id) {
          const prod = parsed.product;
          const qty = Number(parsed.quantity) || 1;
          const sub = (Number(prod?.price?.payable_price) || Number(prod?.payable_price) || Number(prod?.retail_price) || 0) * qty;
          setProductDetailsData({
            ...prod,
            quantity: qty,
          });
          setDeliveryCharge(0);
          setGrandTotal(sub);
          setBuyNowLoading(false);
        } else if (!parsed?.slug) {
          setBuyNowLoading(false);
        }
      } catch {
        setBuyNowLoading(false);
      }
    } else {
      router.push("/");
    }
  }, [isBuyNow]);

  useEffect(() => {
    if (!isBuyNow || !buyNowData?.slug) return;

    const fetchProductDetailsData = async (slug) => {
      try {
        const response = await axiosInstance.get(`/product-details/${slug}`);
        const prod = response?.data?.data?.product || response?.data?.product;
        if (prod && prod.id) {
          const qty = Number(buyNowData?.quantity) || 1;
          const payable = Number(prod?.price?.payable_price) || Number(prod?.retail_price) || 0;
          setProductDetailsData({
            ...prod,
            quantity: qty,
          });

          const sub = payable * qty;
          setDeliveryCharge(0);
          setGrandTotal(sub);
        }
      } catch (error) {
        // buyNowData.product is already set as fallback
      } finally {
        setBuyNowLoading(false);
      }
    };

    fetchProductDetailsData(buyNowData?.slug);
  }, [isBuyNow, buyNowData?.slug]);

  // Handle Input Changes
  const handleGuestInput = (e) => {
    const { name, value, type, checked } = e.target;
    setGuestInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (guestErrors[name]) {
      setGuestErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "area") {
      const selectedAreaObj = (areasList || []).find(
        (a) => a.name_en === value || String(a.id) === String(value)
      );
      const fee = Number(selectedAreaObj?.delivery_fee) || 0;
      setDeliveryCharge(fee);

      const sub = isBuyNow
        ? (Number(productDetailsData?.price?.payable_price) || Number(productDetailsData?.retail_price) || 0) * (Number(productDetailsData?.quantity) || 1)
        : Number(cart?.summary?.sub_total) || 0;
      setGrandTotal(sub + fee);
    }
  };

  // Validation matching Kuwait Sanam Store rules
  const validateGuestCheckout = () => {
    const errors = {};

    if (!guestInput.customer_phone.trim()) {
      errors.customer_phone = "Mobile number is required.";
    }

    if (!guestInput.area.trim()) {
      errors.area = "Please choose an area.";
    }

    setGuestErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Quantity updates
  const updateQuantity = (id, variationId, currentQty, increment) => {
    const newQty = increment ? currentQty + 1 : Math.max(1, currentQty - 1);
    updateCart({ product_id: id, variation_id: variationId, quantity: newQty });
  };

  const updateBuyNowQuantity = (increment) => {
    const currentQty = productDetailsData?.quantity || 1;
    const nextQuantity = increment ? currentQty + 1 : Math.max(1, currentQty - 1);
    setProductDetailsData((prev) => ({ ...prev, quantity: nextQuantity }));
    localStorage.setItem("buy_now", JSON.stringify({ ...buyNowData, quantity: nextQuantity }));

    const sub = (productDetailsData?.price?.payable_price || 0) * nextQuantity;
    const ship = sub >= 10 ? 0 : 0;
    setDeliveryCharge(ship);
    setGrandTotal(sub + ship);
  };

  // Order Placement
  const handlePlaceOrder = async () => {
    if (!isLoggedIn && !validateGuestCheckout()) {
      toast.error("Please fill in all required fields (Mobile, Area).");
      return;
    }

    const fullAddress = [
      guestInput.area,
      guestInput.block ? `Block: ${guestInput.block}` : "",
      guestInput.street ? `Street: ${guestInput.street}` : "",
      guestInput.avenue ? `Avenue: ${guestInput.avenue}` : "",
      guestInput.building ? `Building/House: ${guestInput.building}` : "",
      guestInput.floor ? `Floor: ${guestInput.floor}` : "",
      guestInput.unit ? `Unit: ${guestInput.unit}` : "",
      guestInput.paci ? `PACI: ${guestInput.paci}` : "",
    ]
      .filter(Boolean)
      .join(", ");

    const orderPayload = {
      customer_name: guestInput.customer_name || "Guest Customer",
      customer_email: guestInput.customer_email || "",
      customer_phone: `${guestInput.phone_prefix}${guestInput.customer_phone}`,
      country: guestInput.country,
      area: guestInput.area,
      block: guestInput.block,
      street: guestInput.street,
      avenue: guestInput.avenue,
      house_no: guestInput.building,
      floor: guestInput.floor,
      unit: guestInput.unit,
      paci: guestInput.paci,
      address: fullAddress,
      payment_method: paymentMethod,
      create_account: guestInput.create_account ? 1 : 0,
      items: isBuyNow
        ? [
            {
              product_id: productDetailsData?.id,
              quantity: productDetailsData?.quantity,
              price: productDetailsData?.price?.payable_price,
            },
          ]
        : cart?.cart?.map((item) => ({
            product_id: item?.id,
            quantity: item?.quantity,
            price: item?.payable_price,
          })) || [],
      ...getGoogleAnalyticsTrackingData(),
    };

    try {
      setLoader(true);
      const response = await axiosInstance.post("/order", orderPayload);
      if (response?.data?.status) {
        toast.success(response?.data?.status_message || "Order placed successfully!");
        fetchCart();
        router.push(`/order-confirmation/${response?.data?.data?.invoice_no}`);
      } else {
        toast.error(response?.data?.status_message || "Order failed.");
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        setGuestErrors(error?.response?.data?.errors || {});
        toast.error(error?.response?.data?.message || "Please check the form for errors.");
      } else {
        toast.error(error?.response?.data?.message || error?.message || "Failed to place order.");
      }
    } finally {
      setLoader(false);
    }
  };

  const items = isBuyNow
    ? productDetailsData?.id
      ? [
          {
            id: productDetailsData?.id,
            photo: productDetailsData?.photo,
            product_name: productDetailsData?.name,
            payable_price: productDetailsData?.price?.payable_price || productDetailsData?.retail_price,
            quantity: productDetailsData?.quantity || 1,
          },
        ]
      : []
    : cart?.cart || [];

  const subTotal = isBuyNow
    ? (productDetailsData?.price?.payable_price || 0) * (productDetailsData?.quantity || 1)
    : cart?.summary?.sub_total || cart?.summary?.total || 0;

  const currentGrandTotal = isBuyNow ? grandTotal : (cart?.summary?.total || subTotal) + deliveryCharge;

  const pageLoading = isBuyNow ? buyNowLoading : loading;
  const hasContent = isBuyNow ? Boolean(productDetailsData?.id) : Boolean(cart?.cart?.length);

  if (pageLoading) {
    return <Loading />;
  }

  if (!hasContent) {
    return <EmptyCart />;
  }

  return (
    <div className="container py-4 my-3" style={{ maxWidth: "1240px" }}>
      {/* Blocked Notification */}
      {blockedInfo.isBlocked && (
        <div className="alert alert-danger text-center mb-4">
          <h5>You are temporarily blocked from placing orders.</h5>
          <p className="mb-0">Please try again after {blockedInfo.remainingMinutes} minutes.</p>
        </div>
      )}

      <div className="row g-4">
        {/* ================= LEFT COLUMN: CUSTOMER DETAILS & PAYMENT ================= */}
        <div className="col-12 col-lg-8">
          {/* Customer & Address Form Card */}
          <div className="bg-white p-4 rounded-3 shadow-sm border mb-4">
            <div className="row g-3">
              {/* Name */}
              <div className="col-12 col-md-6">
                <label className="form-label text-muted small mb-1 fw-medium">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  name="customer_name"
                  value={guestInput.customer_name}
                  onChange={handleGuestInput}
                />
              </div>

              {/* Email */}
              <div className="col-12 col-md-6">
                <label className="form-label text-muted small mb-1 fw-medium">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  name="customer_email"
                  value={guestInput.customer_email}
                  onChange={handleGuestInput}
                />
              </div>

              {/* Mobile */}
              <div className="col-12 col-md-6">
                <label className="form-label small mb-1 fw-medium">
                  Mobile <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted fw-semibold">965</span>
                  <input
                    type="tel"
                    className={`form-control ${guestErrors.customer_phone ? "is-invalid" : ""}`}
                    placeholder="Enter your mobile number"
                    name="customer_phone"
                    value={guestInput.customer_phone}
                    onChange={handleGuestInput}
                    required
                  />
                </div>
                {guestErrors.customer_phone && (
                  <small className="text-danger">{guestErrors.customer_phone}</small>
                )}
              </div>

              {/* Country */}
              <div className="col-12 col-md-6">
                <label className="form-label small mb-1 fw-medium">
                  Country <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select bg-light"
                  name="country"
                  value={guestInput.country}
                  onChange={handleGuestInput}
                >
                  <option value="Kuwait">Kuwait</option>
                </select>
              </div>

              {/* Area */}
              <div className="col-12 col-md-6">
                <label className="form-label small mb-1 fw-medium">
                  Area <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${guestErrors.area ? "is-invalid" : ""}`}
                  name="area"
                  value={guestInput.area}
                  onChange={handleGuestInput}
                  required
                >
                  <option value="">Choose Area</option>
                  {areasList.map((area) => (
                    <option key={area.id} value={area.name_en}>
                      {area.name_en} {area.name_ar ? `(${area.name_ar})` : ""}
                    </option>
                  ))}
                </select>
                {guestErrors.area && (
                  <small className="text-danger">{guestErrors.area}</small>
                )}
              </div>

              {/* Block */}
              <div className="col-12 col-md-6">
                <label className="form-label text-muted small mb-1 fw-medium">Block</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your block"
                  name="block"
                  value={guestInput.block}
                  onChange={handleGuestInput}
                />
              </div>

              {/* Street */}
              <div className="col-12 col-md-3">
                <label className="form-label text-muted small mb-1 fw-medium">Street</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your street"
                  name="street"
                  value={guestInput.street}
                  onChange={handleGuestInput}
                />
              </div>

              {/* Avenue */}
              <div className="col-12 col-md-3">
                <label className="form-label text-muted small mb-1 fw-medium">Avenue</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your avenue"
                  name="avenue"
                  value={guestInput.avenue}
                  onChange={handleGuestInput}
                />
              </div>

              {/* Building/House */}
              <div className="col-12 col-md-3">
                <label className="form-label text-muted small mb-1 fw-medium">Building/House</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your building/house"
                  name="building"
                  value={guestInput.building}
                  onChange={handleGuestInput}
                />
              </div>

              {/* Floor */}
              <div className="col-12 col-md-3">
                <label className="form-label text-muted small mb-1 fw-medium">Floor</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your floor"
                  name="floor"
                  value={guestInput.floor}
                  onChange={handleGuestInput}
                />
              </div>

              {/* Unit */}
              <div className="col-12 col-md-6">
                <label className="form-label text-muted small mb-1 fw-medium">Unit</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your unit if available"
                  name="unit"
                  value={guestInput.unit}
                  onChange={handleGuestInput}
                />
              </div>

              {/* Paci */}
              <div className="col-12 col-md-6">
                <label className="form-label text-muted small mb-1 fw-medium">Paci</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Paci"
                  name="paci"
                  value={guestInput.paci}
                  onChange={handleGuestInput}
                />
              </div>

              {/* Create Account Checkbox */}
              <div className="col-12 mt-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="createAccountCheck"
                    name="create_account"
                    checked={guestInput.create_account}
                    onChange={handleGuestInput}
                  />
                  <label
                    className="form-check-label text-uppercase text-muted fw-semibold small cursor-pointer"
                    htmlFor="createAccountCheck"
                  >
                    CREATE AN ACCOUNT
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PAYMENT METHODS ================= */}
          <div className="bg-white p-4 rounded-3 shadow-sm border mb-4">
            <h6 className="fw-bold text-uppercase tracking-wider mb-3">PAYMENT METHODS</h6>
            <div className="d-flex flex-column gap-3">
              {/* Cash on Delivery */}
              <label
                className={`d-flex align-items-center gap-3 p-3 rounded border cursor-pointer ${
                  paymentMethod === "COD" ? "border-primary bg-light" : "border-light-subtle"
                }`}
                onClick={() => setPaymentMethod("COD")}
              >
                <input
                  type="radio"
                  name="payment_method"
                  className="form-check-input mt-0"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <span className="badge bg-light text-dark border px-2 py-1 small fw-bold">
                  💵 CASH ON DELIVERY
                </span>
                <span className="fw-medium text-dark">Cash On Delivery (COD)</span>
              </label>

              {/* MyFatoorah (KNET / VISA / ApplePay) */}
              <label
                className={`d-flex align-items-center gap-3 p-3 rounded border cursor-pointer ${
                  paymentMethod === "MF" ? "border-primary bg-light" : "border-light-subtle"
                }`}
                onClick={() => setPaymentMethod("MF")}
              >
                <input
                  type="radio"
                  name="payment_method"
                  className="form-check-input mt-0"
                  checked={paymentMethod === "MF"}
                  onChange={() => setPaymentMethod("MF")}
                />
                <div className="d-flex align-items-center gap-1">
                  <span className="badge bg-primary text-white px-2 py-1 small fw-bold">KNET</span>
                  <span className="badge bg-warning text-dark px-2 py-1 small fw-bold">VISA</span>
                  <span className="badge bg-dark text-white px-2 py-1 small fw-bold">Pay</span>
                </div>
                <span className="fw-medium text-dark">Myfatoorah (MF)</span>
              </label>
            </div>
          </div>

          {/* ================= SHOPPING CART TABLE ================= */}
          <div className="bg-white p-4 rounded-3 shadow-sm border">
            <h6 className="fw-bold text-uppercase tracking-wider mb-3">SHOPPING CART</h6>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light small text-muted">
                  <tr>
                    <th style={{ width: "90px" }}>Image</th>
                    <th>Details</th>
                    <th>Unit price</th>
                    <th>Unit tax</th>
                    <th>Quantity</th>
                    <th className="text-end">Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item?.id}>
                      <td>
                        <div
                          style={{
                            width: "70px",
                            height: "70px",
                            position: "relative",
                            borderRadius: "6px",
                            overflow: "hidden",
                            border: "1px solid #eee",
                          }}
                        >
                          <ImageComponent
                            src={item?.photo}
                            alt={item?.product_name}
                            width={70}
                            height={70}
                            className="w-100 h-100 object-fit-contain"
                          />
                        </div>
                      </td>
                      <td>
                        <p className="mb-0 fw-semibold text-dark small" style={{ maxWidth: "260px" }}>
                          {item?.product_name}
                        </p>
                      </td>
                      <td className="fw-bold text-dark small">
                        KWD {(Number(item?.payable_price) || 0).toFixed(3)}
                      </td>
                      <td className="text-muted small">KWD</td>
                      <td>
                        <div className="d-inline-flex align-items-center border rounded">
                          <button
                            type="button"
                            className="btn btn-sm btn-light py-0 px-2 text-muted"
                            onClick={() =>
                              isBuyNow
                                ? updateBuyNowQuantity(false)
                                : updateQuantity(item?.id, item?.variation_id, item?.quantity, false)
                            }
                          >
                            -
                          </button>
                          <span className="px-2 small fw-bold">{item?.quantity}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-light py-0 px-2 text-muted"
                            onClick={() =>
                              isBuyNow
                                ? updateBuyNowQuantity(true)
                                : updateQuantity(item?.id, item?.variation_id, item?.quantity, true)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-end fw-bold text-dark small">
                        KWD {(Number(item?.payable_price * item?.quantity) || 0).toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: ORDER SUMMARY ================= */}
        <div className="col-12 col-lg-4">
          <div className="bg-white p-4 rounded-3 shadow-sm border position-sticky" style={{ top: "90px" }}>
            <h5 className="fw-bold mb-4 pb-2 border-bottom">Order Summary</h5>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">
                SUB TOTAL <span className="text-info small">(Including Tax)</span>
              </span>
              <span className="fw-semibold small">KWD {(Number(subTotal) || 0).toFixed(3)}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">TAX</span>
              <span className="fw-semibold small">KWD 0.000</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">DELIVERY CHARGES</span>
              <span className="fw-semibold small text-success">
                + KWD {(Number(deliveryCharge) || 0).toFixed(3)}
              </span>
            </div>

            <hr className="my-3" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold fs-6 text-uppercase" style={{ color: "#d92534" }}>
                GRAND TOTAL
              </span>
              <span className="fw-bold fs-5" style={{ color: "#d92534" }}>
                KWD {(Number(currentGrandTotal) || 0).toFixed(3)}
              </span>
            </div>

            <button
              type="button"
              className="btn w-100 py-3 text-white fw-bold text-uppercase shadow-sm"
              style={{
                backgroundColor: "#00ADEF",
                borderColor: "#00ADEF",
                letterSpacing: "0.5px",
                fontSize: "15px",
              }}
              onClick={handlePlaceOrder}
              disabled={loader || blockedInfo.isBlocked}
            >
              {loader ? (
                <span>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  PLACING ORDER...
                </span>
              ) : (
                "PLACE YOUR ORDER"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
