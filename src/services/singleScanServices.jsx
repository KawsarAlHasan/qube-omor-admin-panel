import { useQuery } from "@tanstack/react-query";
import { getMockSingleScans } from "../api/api";

export const useSingleScans = (options = {}) => {
  const {
    data: singleScans = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleScans"],
    queryFn: getMockSingleScans,
    enabled: options.enabled ?? true,
  });

  return { singleScans, isLoading, isError, error, refetch };
};
