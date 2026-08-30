import axios from "axios";
import PageCommon from "@/components/Pages/PageCommon";
import { API_BASE_URL } from "@/utils/apiBase";

const DeliveryAndReturnPolicy = async () => {
  const fetchData = async () => {
    try {
      const companyData = await axios.get(`${API_BASE_URL}/shipping-policy`);
      return companyData.data.data;
    } catch (error) {
      console.warn("Failed to fetch delivery and return policy:", error?.message);
      return {
        title: "Delivery and Return Policy",
        description: "",
      };
    }
  };
  const data = await fetchData();
  return <PageCommon data={data} />;
};

export default DeliveryAndReturnPolicy;
