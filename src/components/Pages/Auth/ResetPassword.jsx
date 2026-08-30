"use client";

import Form from "@/components/shared/Form/Form";
import Input from "@/components/shared/Form/Input";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ResetPassword = ({ searchParams }) => {
  const { register, handleSubmit, reset } = useForm();
  const [errorMessage, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async ({ password }) => {
    try {
      const response = await axiosInstance.post("/password/reset", {
        password,
        ...searchParams,
      });
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
    <div className="resetPasswordPage">
      <div className="forgotPasswordWrapper">
        <div className="shadow p-4">
          <div className="header">
            <h1>Reset Password</h1>
          </div>

          <Form onSubmit={handleSubmit(handlePasswordReset)}>
            <div>
              <label className="mb-1 fw-medium" htmlFor="email">
                Email
              </label>

              <Input
                register={register("email")}
                id="email"
                placeholder="Email"
                errorMessage={errorMessage}
                defaultValue={searchParams?.email}
                disabled
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
  );
};

export default ResetPassword;
