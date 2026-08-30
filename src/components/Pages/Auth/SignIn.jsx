"use client";

import SocialSignIn from "@/components/Pages/Auth/SocialLoginComponent";
import Button from "@/components/shared/Form/Button";
import Form from "@/components/shared/Form/Form";
import Input from "@/components/shared/Form/Input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getCookie, setCookie } from "cookies-next";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const [activeTab, setActiveTab] = useState("loginWithOTP");
  const [otpSent, setIsOtpSent] = useState(false);
  const [email_or_phone, setEmail_or_phone] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAuth = async (data) => {
    let requestData = {};
    if (activeTab === "loginWithOTP") {
      requestData = {
        email_or_phone: data.email_or_phone,
        otp_login_request: true,
      };
    } else {
      requestData = {
        email_or_phone: data.email_or_phone,
        password: data.password,
      };
    }

    try {
      const response = await axiosInstance.post("/login", requestData);
      if (response?.data?.status) {
        setErrorMessage({});
        setCookie("token", response?.data?.data?.token);
        localStorage.setItem("token", response?.data?.data?.token);

        if (activeTab === "loginWithOTP") {
          toast.success(response?.data?.status_message);
          setIsOtpSent(true);
          setEmail_or_phone(data.email_or_phone);
          reset();
        } else {
          window.location.href = `${
            getCookie("lastVisitedPath") ? getCookie("lastVisitedPath") : "/"
          }`;
        }
      } else {
        toast.error(response?.data?.status_message);
      }
    } catch (error) {
      if (error?.status === 422) {
        setErrorMessage(error?.response?.data?.errors);
      } else {
        throw new Error(error?.message);
      }
    }
  };

  const handleOTPSignIn = async (data) => {
    try {
      const response = await axiosInstance.post("/login", {
        email_or_phone: email_or_phone,
        ...data,
      });
      if (response?.data?.status) {
        setErrorMessage({});
        reset();
        setCookie("token", response?.data?.data?.token);
        localStorage.setItem("token", response?.data?.data?.token);

        window.location.href = `${
          getCookie("lastVisitedPath") ? getCookie("lastVisitedPath") : "/"
        }`;
      } else {
        toast.error(response?.data?.status_message);
      }
    } catch (error) {
      if (error?.status === 422) {
        setErrorMessage(error?.response?.data?.errors);
      } else {
        throw new Error(error?.message);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <h1 className="d-none">Sign In</h1>
      <div className="authContainer shadow-lg">
        <div className="tabs">
          <button
            className={activeTab === "loginWithOTP" ? "active" : ""}
            onClick={() => handleTabClick("loginWithOTP")}
          >
            Login with OTP
          </button>

          <button
            className={activeTab === "loginWithPassword" ? "active" : ""}
            onClick={() => handleTabClick("loginWithPassword")}
          >
            Login with Password
          </button>
        </div>

        {activeTab === "loginWithOTP" ? (
          <>
            {otpSent ? (
              <Form onSubmit={handleSubmit(handleOTPSignIn)}>
                <div className="otp">
                  <label htmlFor="otp">OTP</label>

                  <Input
                    register={register("otp")}
                    id="otp"
                    placeholder="6 digit-OTP"
                    errorMessage={errorMessage}
                  />

                  <div className="mt-3 d-flex justify-content-center gap-4">
                    <Button type="submit">Confirm</Button>
                    <button onClick={() => setIsOtpSent(false)}>
                      Try again
                    </button>
                  </div>
                </div>
              </Form>
            ) : (
              <Form onSubmit={handleSubmit(handleAuth)}>
                <div className="phone">
                  <label htmlFor="email_or_phone">Phone</label>

                  <Input
                    register={register("email_or_phone")}
                    id="email_or_phone"
                    placeholder="Phone"
                    errorMessage={errorMessage}
                  />
                </div>

                <Button type="submit">Send OTP</Button>
              </Form>
            )}
          </>
        ) : (
          <Form onSubmit={handleSubmit(handleAuth)}>
            <div className="email">
              <label htmlFor="email_or_phone">Email or Phone</label>

              <Input
                register={register("email_or_phone")}
                id="email_or_phone"
                placeholder="Enter Email or Phone"
                errorMessage={errorMessage}
              />
            </div>

            <div className="password">
              <label htmlFor="password">Password</label>

              <Input
                register={register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                errorMessage={errorMessage}
              />

              {showPassword ? (
                <i
                  onClick={() => setShowPassword(false)}
                  className="fa-solid fa-eye"
                ></i>
              ) : (
                <i
                  onClick={() => setShowPassword(true)}
                  className="fa-solid fa-eye-slash"
                ></i>
              )}

              <Link
                href="/forgot-password"
                className="text-end mt-2 text-purple d-inline-block w-100 fw-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <Button>Login</Button>
          </Form>
        )}

        <SocialSignIn href="/sign-up" />
      </div>
    </div>
  );
};

export default SignIn;
