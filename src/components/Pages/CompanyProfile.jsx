import axiosInstance from "@/utils/axiosInstance";
import PageCommon from "@/components/Pages/PageCommon";

const CompanyProfile = async () => {
  const fetchData = async () => {
    try {
      const companyData = await axiosInstance.get(`/company-profile`);
      return companyData.data.data;
    } catch (error) {
      console.error("Failed to fetch company profile data:", error);
      // Return fallback data instead of throwing error during build
      return {
        title: "Company Profile",
        content: "Loading company information...",
        description: "",
        // Add any default structure your PageCommon component expects
      };
    }
  };

  const data = await fetchData();
  return <PageCommon data={data} />;
};

export default CompanyProfile;
