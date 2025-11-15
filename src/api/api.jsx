import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get admin dashboard
export const useAdminProfile = () => {
  const getData = async () => {
    const response = await API.get("/admin/profile");
    return response.data.data;
  };

  const {
    data: adminProfile = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: getData,
  });

  return { adminProfile, isLoading, isError, error, refetch };
};

// sign out
export const signOutAdmin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// all admins list
export const useAdminList = () => {
  const getData = async () => {
    const response = await API.get("/admin/all");
    return response.data;
  };

  const {
    data: adminList = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminList"],
    queryFn: getData,
  });

  return { adminList, isLoading, isError, error, refetch };
};

