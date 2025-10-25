import { useQuery } from "@tanstack/react-query";
import axios from "axios";



// users list for messages
export const getMockUsersForMessages = async () => {
  const response = await axios.get("/messageUserList.json");

  return response.data;
};

export const useUsersForMessage = () => {
  const {
    data: usersForMessage = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["usersForMessage"],
    queryFn: getMockUsersForMessages,
  });

  return { usersForMessage, isLoading, isError, error, refetch };
};