import { useQuery } from "@tanstack/react-query";
import { getMockAdministrators } from "../api/api";

export const useAdministrators = () => {
  const {
    data: administrators = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["administrators"],
    queryFn: getMockAdministrators,
  });

  return { administrators, isLoading, isError, error, refetch };
};
