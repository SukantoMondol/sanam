import axios from "axios";
import PageCommon from "@/components/Pages/PageCommon";
import { API_BASE_URL } from "@/utils/apiBase";

const TermsAndCondition = async () => {
  const fetchData = async () => {
    try {
      const companyData = await axios.get(
        `${API_BASE_URL}/terms-and-conditions`
      );
      return companyData.data.data;
    } catch (error) {
      console.warn("Failed to fetch terms and conditions:", error?.message);
      return {
        title: "Terms and Conditions",
        description: "",
      };
    }
  };
  const data = await fetchData();

  return <PageCommon data={data} />;
};

export default TermsAndCondition;
