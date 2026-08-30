"use client";

import Button from "@/components/shared/Form/Button";
import Form from "@/components/shared/Form/Form";
import Input from "@/components/shared/Form/Input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SocialSignIn from "@/components/Pages/Auth/SocialLoginComponent";
import { toast } from "react-toastify";
import { getCookie, setCookie } from "cookies-next";
import axiosInstance from "@/utils/axiosInstance";

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [activeTab, setActiveTab] = useState("registrationForm");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/register", data);
      if (response?.data?.status) {
        setErrorMessage({});
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
      <h1 className="d-none">Sign Up</h1>
      <div className="authContainer shadow-lg">
        <div className="tabs">
          <button
            className={activeTab === "registrationForm" && "active"}
            onClick={() => handleTabClick("registrationForm")}
          >
            Registrantion Form
          </button>
        </div>

        {activeTab === "registrationForm" && (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="name">
              <label htmlFor="name">Name</label>

              <Input
                register={register("name")}
                id="name"
                placeholder="Name"
                errorMessage={errorMessage}
              />
            </div>

            <div className="phone">
              <label htmlFor="phone">Phone</label>

              <Input
                register={register("phone")}
                id="phone"
                placeholder="Phone"
                errorMessage={errorMessage}
              />
            </div>

            <div className="email">
              <label htmlFor="Email">Email</label>

              <Input
                register={register("email")}
                id="email"
                placeholder="Email"
                errorMessage={errorMessage}
              />
            </div>

            <div className="password">
              <label htmlFor="password">Password</label>

              <Input
                register={register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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

            <Button type="submit">Register</Button>
          </Form>
        )}

        <SocialSignIn href="/sign-in" />
      </div>
    </div>
  );
};

export default SignUp;
