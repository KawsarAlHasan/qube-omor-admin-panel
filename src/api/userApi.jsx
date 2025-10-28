import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "./api";

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

// user conversations list for messages
export const useUsersForMessages = ({ search }) => {
  const getData = async () => {
    const response = await API.get("/message/user-list", {
      params: { search },
    });
    return response.data.data;
  };

  const {
    data: usersForMessages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["usersForMessages", search],
    queryFn: getData,
  });

  return { usersForMessages, isLoading, isError, error, refetch };
};

// get user conversations
export const useUserConversations = ({ page = 1, limit = 50, userId }) => {
  const getData = async () => {
    const response = await API.get(`/message/conversations/${userId}`, {
      params: { page, limit },
    });
    return response.data.data;
  };

  const {
    data: userConversations = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userConversations", page, limit],
    queryFn: getData,
  });

  return { userConversations, isLoading, isError, error, refetch };
};
