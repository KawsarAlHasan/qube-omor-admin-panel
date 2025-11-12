import { useQuery } from "@tanstack/react-query";
import { API } from "./api";

// get user List
export const useUsersList = ({ page = 1, limit = 20, role, status, name }) => {
  const getData = async () => {
    const response = await API.get("/user/all", {
      params: { page, limit, role, status, name },
    });
    return response.data;
  };

  const {
    data: usersList = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["usersList", page, limit, role, status, name],
    queryFn: getData,
  });

  return { usersList, isLoading, isError, error, refetch };
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
