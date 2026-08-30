"use client";
import React, { useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

const GENERAL_SETTINGS_CACHE_TIME = 10 * 60 * 1000;
const GENERAL_SETTINGS_CACHE_KEY = "generalSettings";
const GENERAL_SETTINGS_CACHE_TIME_KEY = "generalSettingsFetchedAt";

const GeneralSetting = () => {
  const getGeneralSettings = async () => {
    try {
      const fetchedAt = Number(
        localStorage.getItem(GENERAL_SETTINGS_CACHE_TIME_KEY) || 0
      );
      if (
        localStorage.getItem(GENERAL_SETTINGS_CACHE_KEY) &&
        Date.now() - fetchedAt < GENERAL_SETTINGS_CACHE_TIME
      ) {
        return;
      }

      const res = await axiosInstance.get("/general-settings");
      if (res?.data?.data) {
        localStorage.setItem(
          GENERAL_SETTINGS_CACHE_KEY,
          JSON.stringify(res.data.data)
        );
        localStorage.setItem(
          GENERAL_SETTINGS_CACHE_TIME_KEY,
          Date.now().toString()
        );
      }
    } catch (error) {
      console.error("Failed to load general settings:", error);
    }
  };

  useEffect(() => {
    getGeneralSettings();
  }, []);

  return null;
};

export default GeneralSetting;
