import { useQuery } from "@tanstack/react-query";
import { API } from "./api";

// get all spa
export const useAllSpas = ({ type, date }) => {
  const getData = async () => {
    const response = await API.get("/spa/admin", {
      params: { type, date },
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
    queryKey: ["spaData", type, date],
    queryFn: getData,
  });

  return { spaData, isLoading, isError, error, refetch };
};

// single spa data
export const useSingleSpaData = ({ id }, options = {}) => {
  const getData = async ({ queryKey }) => {
    const [_key, id] = queryKey;
    const response = await API.get(`/spa/with-users/${id}`);
    return response.data;
  };

  const {
    data: singleSpaData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleSpaData", id],
    queryFn: getData,
    enabled: !!id && (options.enabled ?? true),
  });

  return { singleSpaData, isLoading, isError, error, refetch };
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

// /credit/all-buy-credits
export const useCreditsBuyers = ({ page = 1, limit = 20 }) => {
  const getData = async () => {
    const response = await API.get("/credit/all-buy-credits", {
      params: { page, limit },
    });
    return response.data;
  };

  const {
    data: creditBuyers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["creditBuyers", page, limit],
    queryFn: getData,
  });

  return { creditBuyers, isLoading, isError, error, refetch };
};
