"use client";
import { useState } from "react";
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import dynamic from "next/dynamic";

export default function ProductRequest() {
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [error, setError] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_number: "",
    customer_email: "",
    product_name: "",
    product_details: "",
    product_image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (recaptchaToken) {
      axiosInstance
        .post(`/product-request`, formData)
        .then((res) => {
          if (res?.data?.status) {
            setFormData({
              customer_name: "",
              customer_number: "",
              customer_email: "",
              product_name: "",
              product_details: "",
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
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
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
    <div className="container py-4 my-2 bg-white product-request-page">
      <div className="row g-0">
        <div className="col-xl-6 d-none d-md-flex align-items-center justify-content-center p-4">
          <Image
            src="/assets/images/banner/product-request.png"
            alt="Deshify Promotion"
            className="img-fluid h-100 w-100 object-fit-cover"
            width={740}
            height={580}
            priority
            fetchPriority="high"
            loading="eager"
            sizes="(max-width: 768px) 100vw, 740px"
          />
        </div>
        <div className="col-xl-6 col-md-12 p-4">
          <h1 className="text-dark fw-bold mb-3 text-center fs-3">
            Product Request
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mt-2 mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-md-25 w-50">
                Customer Name :
              </label>
              <div className={"w-100 w-sm-75"}>
                <input
                  type="text"
                  className={`form-control border-purple w-100 ${
                    error?.customer_name ? "is-invalid" : ""
                  }`}
                  placeholder="Write Customer Name*"
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                />
                <p className={"text-danger"}>
                  <small>{error?.customer_name}</small>
                </p>
              </div>
            </div>
            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-md-25 w-50">
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
                <p className={"text-danger"}>
                  <small>{error?.customer_number}</small>
                </p>
              </div>
            </div>
            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-md-25 w-50">
                Email :
              </label>
              <div className={"w-sm-75 w-100"}>
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
                <p className={"text-danger"}>
                  <small>{error?.customer_email}</small>
                </p>
              </div>
            </div>
            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-md-25 w-50">
                Product Name :
              </label>
              <div className={"w-sm-75 w-100"}>
                <input
                  type="text"
                  className={`form-control border-purple w-100 ${
                    error?.product_name ? "is-invalid" : ""
                  }`}
                  placeholder="Write your Product Name*"
                  value={formData.product_name}
                  onChange={(e) =>
                    setFormData({ ...formData, product_name: e.target.value })
                  }
                />
                <p className={"text-danger"}>
                  <small>{error?.product_name}</small>
                </p>
              </div>
            </div>
            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-md-25 w-50">
                Product Details :
              </label>
              <div className={"w-sm-75 w-100"}>
                <input
                  type="text"
                  className={`form-control border-purple w-100 ${
                    error?.product_details ? "is-invalid" : ""
                  }`}
                  placeholder="Write your Product Details*"
                  value={formData.product_details}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product_details: e.target.value,
                    })
                  }
                />
                <p className={"text-danger"}>
                  <small>{error?.product_details}</small>
                </p>
              </div>
            </div>
            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label
                htmlFor="product_image"
                className="fw-bold text-muted form-label w-md-25 w-50"
              >
                Product Image :
              </label>
              <div className="w-100 w-sm-75">
                <input
                  id="product_image"
                  type="file"
                  className={`form-control border-purple w-100 ${
                    error?.product_image ? "is-invalid" : ""
                  }`}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <p className={"text-danger"}>
                  <small>{error?.product_image}</small>
                </p>
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
                  className="rounded py-2 px-4 mt-3 btn btn-outline-purple w-sm-50"
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    "Send Message"
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
