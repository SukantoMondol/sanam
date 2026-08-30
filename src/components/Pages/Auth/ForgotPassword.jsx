"use client";

import Form from "@/components/shared/Form/Form";
import Input from "@/components/shared/Form/Input";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { register, handleSubmit, reset } = useForm();
  const [errorMessage, setErrorMessage] = useState({});
  const [otp, setOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (data) => {
    try {
      const response = await axiosInstance.post("/password/forget", data);
      if (response?.data?.status) {
        setErrorMessage({});
        reset();
        toast.success(response?.data?.status_message);
        setOtp(response?.data?.data?.otp);
        setPhoneNumber(data?.email_or_phone);
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

  const handlePasswordReset = async (data) => {
    try {
      const response = await axiosInstance.post("/password/reset-otp", data);
      if (response?.data?.status) {
        setErrorMessage({});
        reset();
        toast.success(response?.data?.status_message);
        router.push("/sign-in");
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
    <>
      {otp ? (
        <div className="resetPasswordPage">
          <div className="forgotPasswordWrapper">
            <div className="shadow p-4">
              <div className="header">
                <h1>Reset Password</h1>
              </div>

              <Form onSubmit={handleSubmit(handlePasswordReset)}>
                <div>
                  <label className="mb-1 fw-medium" htmlFor="email">
                    Phone
                  </label>

                  <Input
                    register={register("phone")}
                    id="phone"
                    placeholder="Phone"
                    errorMessage={errorMessage}
                    defaultValue={phoneNumber}
                    disabled
                  />
                </div>

                <div>
                  <label className="mb-1 fw-medium" htmlFor="email">
                    OTP
                  </label>

                  <Input
                    register={register("otp")}
                    id="otp"
                    placeholder="OTP"
                    errorMessage={errorMessage}
                  />
                </div>

                <div className="password">
                  <label className="mb-1 fw-medium" htmlFor="password">
                    Password
                  </label>

                  <Input
                    register={register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter New Password"
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
                </div>

                <input type="submit" value="Confirm" />
              </Form>
            </div>
          </div>
        </div>
      ) : (
        <div className="forgotPasswordPage">
          <div className="forgotPasswordWrapper">
            <div className="shadow p-4">
              <div className="header">
                <h1>Forgot your password?</h1>
                <p className="mt-2">
                  Enter your email address below and we will send you a link to
                  reset your password
                </p>
              </div>

              <Form onSubmit={handleSubmit(handleForgotPassword)}>
                <div>
                  <label className="mb-1 fw-medium" htmlFor="email_or_phone">
                    Email or Phone
                  </label>

                  <Input
                    register={register("email_or_phone")}
                    id="email_or_phone"
                    placeholder="Enter Email or Phone"
                    errorMessage={errorMessage}
                  />
                </div>

                <input type="submit" value="Verification" />
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
