import { useQuery } from "@tanstack/react-query";
import { getMockPreviousScans } from "../api/api";

export const usePreviousScans = (options = {}) => {
  const {
    data: previousScans = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["previousScans"],
    queryFn: getMockPreviousScans,
    enabled: options.enabled ?? true,
  });

  return { previousScans, isLoading, isError, error, refetch };
};
