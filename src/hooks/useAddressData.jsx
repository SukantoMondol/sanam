import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

const useAddressData = () => {
  const [divisionsArray, setDivisionsArray] = useState([]);
  const [districtsArray, setDistrictsArray] = useState([]);
  const [zonesArray, setZonesArray] = useState([]);

  const [selectedDivision, setSelectedDivision] = useState({
    label: "Division",
    value: "",
  });
  const [selectedDistrict, setSelectedDistrict] = useState({
    label: "District",
    value: "",
  });

  const [selectedZone, setSelectedZone] = useState({
    label: "Zone",
    value: "",
  });

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axiosInstance.get("/divisions");
        if (response?.data?.status) {
          setDivisionsArray(response?.data?.data);
        } else {
          toast.error(response?.data?.status_message);
        }
      } catch (error) {
        throw new Error(error?.message);
      }
    };
    fetchDivisions();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axiosInstance.get(
          `/cities/${selectedDivision?.value}`
        );
        if (response?.data?.status) {
          setDistrictsArray(response?.data?.data);
        } else {
          toast.error(response?.data?.status_message);
        }
      } catch (error) {
        throw new Error(error?.message);
      }
    };

    if (selectedDivision.value) {
      fetchDistricts();
    }
  }, [selectedDivision?.value]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axiosInstance.get(
          `/zones/${selectedDistrict?.value}`
        );
        if (response?.data?.status) {
          setZonesArray(response?.data?.data);
        } else {
          toast.error(response?.data?.status_message);
        }
      } catch (error) {
        throw new Error(error?.message);
      }
    };

    if (selectedDistrict.value) {
      fetchZones();
    }
  }, [selectedDistrict?.value]);

  return {
    divisionsArray,
    districtsArray,
    zonesArray,
    selectedDivision,
    setSelectedDivision,
    selectedDistrict,
    setSelectedDistrict,
    selectedZone,
    setSelectedZone,
  };
};

export default useAddressData;
