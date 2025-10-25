import { useQuery } from "@tanstack/react-query";
import { getMockPayments } from "../api/api";

export const usePayments = (params) => {
  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["paymentsData", params],
    queryFn: () => getMockPayments(params),
    keepPreviousData: true,
  });

  const { data: paymentsData = [], pagination = {} } = response;

  return { paymentsData, pagination, isLoading, isError, error, refetch };
};
