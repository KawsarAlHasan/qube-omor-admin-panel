import { useQuery } from "@tanstack/react-query";
import { getMockUsers } from "../api/api";


export const useAllUsers = (params) => {
  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allUsers", params],
    queryFn: () => getMockUsers(params),
    keepPreviousData: true,
  });

  const { data: allUsers = [], pagination = {} } = response;

  return { allUsers, pagination, isLoading, isError, error, refetch };
};
