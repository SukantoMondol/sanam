import React from "react";
import axios from "axios";
import PageCommon from "@/components/Pages/PageCommon";
import { API_BASE_URL } from "@/utils/apiBase";

const PrivacyPolicy = async () => {
  const getData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/privacy-policy`);
      return response.data.data;
    } catch (error) {
      console.warn("Failed to fetch privacy policy:", error?.message);
      return {
        title: "Privacy Policy",
        description: "",
      };
    }
  };
  const data = await getData();
  return <PageCommon data={data} />;
};

export default PrivacyPolicy;
