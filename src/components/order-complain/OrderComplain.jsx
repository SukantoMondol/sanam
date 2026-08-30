"use client";

import { useEffect, useState } from "react";
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});
import ImageComponent from "../UI/Cards/ImageComponent";
import SelectInput from "../UI/SelectInput";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

export default function SaleForm() {
  const [token, setToken] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const response = await axiosInstance.get("/my-orders");
        if (response?.data?.status) {
          setOrderList(response?.data?.data?.data);
        } else {
          toast.error(response?.data?.status_message);
        }
      } catch (error) {
        throw new Error(error?.message);
      }
    };
    if (token) fetchOrderList();
  }, [token]);

  const handleRecaptchaChange = (value) => {
    if (value) {
      setRecaptchaToken(value);
    } else {
      setRecaptchaToken("");
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    details: "",
    order_id: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (recaptchaToken) {
      setLoading(true);
      try {
        const response = await axiosInstance.post(
          token ? "/complain" : "/complain-guest",
          {
            ...formData,
            order_id: token
              ? selectedOrder?.value?.toString()
              : formData.order_id,
          }
        );

        if (response?.data?.status) {
          toast.success(response?.data?.status_message);
          setErrorMessage({});
          setSelectedOrder(null);

          setFormData({
            name: "",
            phone: "",
            email: "",
            subject: "",
            details: "",
            order_id: "",
          });
        } else {
          toast.error(response?.data?.status_message);
        }
      } catch (error) {
        if (error?.response?.status === 422) {
          setErrorMessage(error?.response?.data?.errors);
        } else {
          throw new Error(error?.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please verify you are not a robot");
    }
  };

  return (
    <div className="container py-4 my-2 bg-white order-complain-page">
      <div className="row g-0">
        <div className="col-lg-6 d-none d-md-flex align-items-center justify-content-center p-4">
          <ImageComponent
            src="/assets/images/banner/order-complain.png"
            alt="Deshify Promotion"
            className="img-fluid h-100 w-100 object-fit-cover"
            width={740}
            height={580}
          />
        </div>

        <div className="col-lg-6 col-md-12 p-4">
          <h1 className="fs-4 text-dark fw-semibold mb-3 text-center">
            Order Complain
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-25">
                Name :
              </label>
              <div className="w-100 w-sm-75">
                <input
                  type="text"
                  className="form-control border-purple"
                  placeholder="Write your name*"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                {errorMessage?.name && (
                  <span className="text-danger error-message">
                    {errorMessage?.name}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-25">
                Phone :
              </label>

              <div className="w-sm-75 w-100">
                <input
                  type="tel"
                  className="form-control border-purple"
                  placeholder="Your phone*"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                {errorMessage?.phone && (
                  <span className="text-danger error-message">
                    {errorMessage?.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-25">
                Email :
              </label>
              <div className="w-sm-75 w-100">
                <input
                  type="email"
                  className="form-control border-purple"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                {errorMessage?.email && (
                  <span className="text-danger error-message">
                    {errorMessage?.email}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-25">
                Subject :
              </label>

              <div className="w-sm-75 w-100">
                <input
                  type="text"
                  className="form-control border-purple"
                  placeholder="Your subject*"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />

                {errorMessage?.subject && (
                  <span className="text-danger error-message">
                    {errorMessage?.subject}
                  </span>
                )}
              </div>
            </div>

            {token ? (
              <div className="d-flex flex-column flex-sm-row mb-3 pb-1">
                <label className="fw-bold text-muted form-label w-25">
                  Order Id :
                </label>

                <div className="w-sm-75 w-100">
                  <SelectInput
                    required
                    array={orderList?.map(({ id }) => ({
                      value: id,
                      label: id,
                    }))}
                    state={selectedOrder}
                    setState={setSelectedOrder}
                    placeholder="Select order"
                    id="order_id"
                    error={errorMessage}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-3 d-flex flex-column flex-sm-row">
                <label className="fw-bold text-muted form-label w-25">
                  Order Id :
                </label>

                <div className="w-sm-75 w-100">
                  <input
                    type="text"
                    className="form-control border-purple"
                    placeholder="Your order id*"
                    value={formData.order_id}
                    onChange={(e) =>
                      setFormData({ ...formData, order_id: e.target.value })
                    }
                  />

                  {errorMessage?.order_id && (
                    <span className="text-danger error-message">
                      {errorMessage?.order_id}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mb-3 d-flex flex-column flex-sm-row">
              <label className="fw-bold text-muted form-label w-25">
                Message :
              </label>

              <div className="w-sm-75 w-100">
                <textarea
                  className="form-control border-purple"
                  placeholder="Write your complain*"
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  rows={3}
                />

                {errorMessage?.details && (
                  <span className="text-danger error-message">
                    {errorMessage?.details}
                  </span>
                )}
              </div>
            </div>
            <div className="mb-3 d-flex flex-column flex-sm-row">
              <div className="w-25"></div>
              <div className="w-sm-75 w-100">
                <ReCAPTCHA
                  sitekey={process.env.RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                />
              </div>
            </div>
            <div className="mb-3 d-flex flex-column flex-sm-row">
              <div className="w-25"></div>
              <div className="w-sm-75 w-100">
                <button
                  disabled={loading}
                  type="submit"
                  className="rounded py-2 px-4 mt-3  btn btn-outline-purple w-sm-50 "
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
