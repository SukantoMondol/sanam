"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ImageComponent from "../UI/Cards/ImageComponent";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});

export default function SaleForm() {
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const [error, setError] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_number: "",
    customer_email: "",
    product_name: "",
    product_details: "",
    sale_price: "",
    stock_quantity: "",
    product_image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (recaptchaToken) {
      setIsLoading(true);
      axiosInstance
        .post("deshify-sale", formData)
        .then((res) => {
          if (res?.data?.status) {
            setFormData({
              customer_name: "",
              customer_number: "",
              customer_email: "",
              product_name: "",
              product_details: "",
              sale_price: "",
              stock_quantity: "",
              product_image: null,
            });
            toast.success(res?.data?.status_message);
            setError({});
          } else {
            toast.error(res?.data?.status_message);
          }
        })
        .catch((error) => {
          if (error?.response?.status === 422) {
            setError(error?.response?.data?.errors);
          } else {
            throw new Error(error?.message);
          }
        })
        .finally(function () {
          setIsLoading(false);
        });
    } else {
      toast.error("Please verify you are not a robot");
    }
  };

  const handleFileChange = (e) => {
    // if (e.target.files && e.target.files[0]) {
    //   setFormData({ ...formData, productImage: e.target.files[0] });
    // }

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, product_image: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, product_image: null });
    }
  };

  const handleRecaptchaChange = (value) => {
    if (value) {
      setRecaptchaToken(value);
    } else {
      setRecaptchaToken("");
    }
  };

  return (
    <div className="container p-4 my-2 bg-white sell-on-sanam-store-page">
      <div className="row g-0 align-items-center">
        {/* Left Hero Card */}
        <div className="col-xl-6 d-none d-md-flex flex-column align-items-center justify-content-center p-5 text-center rounded-4" style={{ background: "linear-gradient(135deg, #eef9fd 0%, #f4eafd 100%)", minHeight: "480px" }}>
          <img
            src="/assets/images/logo.png"
            alt="Sanam Store"
            style={{ width: "110px", height: "auto", marginBottom: "24px" }}
          />
          <h2 className="fw-bold mb-3" style={{ color: "#00ADEF" }}>
            Start Selling On <span style={{ color: "#7b189f" }}>Sanam Store</span>
          </h2>
          <p className="text-muted fs-6 mb-4" style={{ maxWidth: "420px" }}>
            Grow your business with Sanam Store in Kuwait. List your products and reach thousands of active buyers today.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <span className="badge bg-white text-dark border px-3 py-2 shadow-sm rounded-pill">
              ⚡ Fast Approval
            </span>
            <span className="badge bg-white text-dark border px-3 py-2 shadow-sm rounded-pill">
              🇰🇼 Kuwait Marketplace
            </span>
            <span className="badge bg-white text-dark border px-3 py-2 shadow-sm rounded-pill">
              💰 Direct Payouts
            </span>
          </div>
        </div>

        <div className="col-xl-6 col-md-12 p-4">
          <h1 className="text-dark fw-bold mb-3 text-center fs-3">
            Sell on {process.env.NEXT_PUBLIC_SITE_NAME}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mt-2 mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-md-25 w-50">
                Customer Name :
              </label>
              <div className={"w-100 w-sm-75"}>
                <input
                  type="text"
                  className={`form-control  border-purple w-100 ${
                    error?.customer_name ? "is-invalid" : ""
                  }`}
                  placeholder="Write Customer Name*"
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                />

                {error?.customer_name && (
                  <small className="text-danger d-block">
                    {error?.customer_name}
                  </small>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted fw-bold text-muted form-label w-md-25 w-50">
                Phone :
              </label>
              <div className={"w-100 w-sm-75"}>
                <input
                  type="tel"
                  className={`form-control border-purple w-100 ${
                    error?.customer_number ? "is-invalid" : ""
                  }`}
                  placeholder="Your Phone*"
                  value={formData.customer_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer_number: e.target.value,
                    })
                  }
                />

                {error?.customer_number && (
                  <small className="text-danger d-block">
                    {error?.customer_number}
                  </small>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-md-25 w-50">
                Email :
              </label>
              <div className={"w-100 w-sm-75"}>
                <input
                  type="email"
                  className={`form-control border-purple w-100 ${
                    error?.customer_email ? "is-invalid" : ""
                  }`}
                  placeholder="Your Email"
                  value={formData.customer_email}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_email: e.target.value })
                  }
                />

                {error?.customer_email && (
                  <small className="text-danger d-block">
                    {error?.customer_email}
                  </small>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-md-25 w-50">
                Product Name :
              </label>
              <div className={"w-100 w-sm-75"}>
                <input
                  type="text"
                  className={`form-control border-purple w-100 ${
                    error?.product_name ? "is-invalid" : ""
                  }`}
                  placeholder="Write Product Name*"
                  value={formData.product_name}
                  onChange={(e) =>
                    setFormData({ ...formData, product_name: e.target.value })
                  }
                />

                {error?.product_name && (
                  <small className="text-danger d-block">
                    {error?.product_name}
                  </small>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-md-25 w-50">
                Product Details :
              </label>
              <div className={"w-100 w-sm-75"}>
                <textarea
                  className={`form-control border-purple w-100 ${
                    error?.product_details ? "is-invalid" : ""
                  }`}
                  placeholder="Write Product Details*"
                  value={formData.product_details}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product_details: e.target.value,
                    })
                  }
                  rows={3}
                />

                {error?.product_details && (
                  <small className="text-danger d-block">
                    {error?.product_details}
                  </small>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className=" fw-bold text-muted form-label w-md-25 w-50">
                Sale Price :
              </label>
              <div className="w-100 w-sm-75">
                <input
                  type="text"
                  className={`form-control border-purple w-100 ${
                    error?.sale_price ? "is-invalid" : ""
                  }`}
                  placeholder="Write Sale Price*"
                  value={formData.sale_price}
                  onChange={(e) =>
                    setFormData({ ...formData, sale_price: e.target.value })
                  }
                />

                {error?.sale_price && (
                  <small className="text-danger d-block">
                    {error?.sale_price}
                  </small>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className=" fw-bold text-muted form-label w-md-25 w-50">
                Stock Quantity :
              </label>
              <div className="w-100 w-sm-75">
                <input
                  type="text"
                  className={`form-control border-purple w-100 ${
                    error?.stock_quantity ? "is-invalid" : ""
                  }`}
                  placeholder="Write Stock Quantity*"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stock_quantity: e.target.value })
                  }
                />

                {error?.stock_quantity && (
                  <small className="text-danger d-block">
                    {error?.stock_quantity}
                  </small>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label
                htmlFor="customer_name"
                className="fw-bold text-muted form-label w-25 w-md-25 w-50"
              >
                Product Image :
              </label>
              <div className="w-75 w-sm-75 w-100">
                <input
                  id="customer_name"
                  type="file"
                  className={`form-control border-purple w-100 ${
                    error?.product_image ? "is-invalid" : ""
                  }`}
                  onChange={handleFileChange}
                  accept="image/*"
                />

                {error?.product_image && (
                  <small className="text-danger d-block">
                    {error?.product_image}
                  </small>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <div className="w-md-25 w-50"></div>
              <div className="w-100 w-sm-75">
                <ReCAPTCHA
                  sitekey={process.env.RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                />
              </div>
            </div>
            <div className="mb-3 d-flex flex-column flex-sm-row">
              <div className="w-md-25 w-50"></div>
              <div className="w-md-75 w-100">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded py-2 px-4 mt-3  btn btn-outline-purple w-sm-50"
                >
                  {isLoading ? (
                    <div className="text-center">
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    `Send Message`
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
