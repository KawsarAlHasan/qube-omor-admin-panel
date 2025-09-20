import { useQuery } from "@tanstack/react-query";
import { getMockMessages } from "../api/api";

export const useUsersForMessage = (options = {}) => {
  const {
    data: usersForMessage = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["usersForMessage"],
    queryFn: getMockMessages,
    enabled: options.enabled ?? true,
  });

  return { usersForMessage, isLoading, isError, error, refetch };
};
