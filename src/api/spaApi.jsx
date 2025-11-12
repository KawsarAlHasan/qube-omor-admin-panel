import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "./api";

// spa booking data
export const useMockSpaBooking = () => {
  const getData = async () => {
    const response = await axios.get("/spaBooking.json");
    return response.data;
  };

  const {
    data: mockSpaBooking = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mockSpaBooking"],
    queryFn: getData,
  });

  return { mockSpaBooking, isLoading, isError, error, refetch };
};

// get all spa
export const useAllSpas = ({ page = 1, limit = 20, type }) => {
  const getData = async () => {
    const response = await API.get("/spa/admin", {
      params: { page, limit, type },
    });
    return response.data;
  };

  const {
    data: spaData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["spaData", page, limit, type],
    queryFn: getData,
  });

  return { spaData, isLoading, isError, error, refetch };
};

// get Credits
export const useCredits = () => {
  const getData = async () => {
    const response = await API.get("/credit/all", {
      params: { status: "all" },
    });
    return response.data;
  };

  const {
    data: credits = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["credits"],
    queryFn: getData,
  });

  return { credits, isLoading, isError, error, refetch };
};
