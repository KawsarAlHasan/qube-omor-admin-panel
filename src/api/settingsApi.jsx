import { useQuery } from "@tanstack/react-query";
import { API } from "./api";

export const useTermsPrivacy = (filter) => {
  const getData = async () => {
    const response = await API.get(`/settings/${filter}`);
    return response.data;
  };

  const {
    data: termsPrivacy = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["termsPrivacy", filter],
    queryFn: getData,
  });

  return { termsPrivacy, isLoading, isError, error, refetch };
};
