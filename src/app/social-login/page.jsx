"use client";

import Loader from "@/components/UI/Shared/Loader";
import axiosInstance from "@/utils/axiosInstance";
import { setCookie } from "cookies-next";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SocialLoginPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const handleSocialLogin = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.post("/social-login", {
            token,
          });

          if (response?.data?.status) {
            setCookie("token", response?.data?.data?.token);
            localStorage.setItem("token", response?.data?.data?.token);
            window.location.href = "/";
          } else {
            toast.error(response?.data?.status_message);
          }
        } catch (error) {
          throw new Error(error?.message);
        } finally {
          setLoading(false);
        }
      };

      handleSocialLogin();
    }
  }, []);

  return <div>{loading && <Loader />}</div>;
};

export default SocialLoginPage;
