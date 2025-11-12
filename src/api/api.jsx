import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get admin dashboard
export const useAdminDashboard = () => {
  const getData = async () => {
    const response = await API.get("/admin/profile");
    return response.data.data;
  };

  const {
    data: adminProfile = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: getData,
  });

  return { adminProfile, isLoading, isError, error, refetch };
};

// sign out
export const signOutAdmin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// all admins list
export const useAdminList = () => {
  const getData = async () => {
    const response = await API.get("/admin/all");
    return response.data;
  };

  const {
    data: adminList = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminList"],
    queryFn: getData,
  });

  return { adminList, isLoading, isError, error, refetch };
};

// users list
export const getMockUsers = async ({ page = 1, limit = 10 }) => {
  const res = await axios.get("/users_100.json");
  const allUsers = res.data || [];

  // Fake filtering (if status or role is provided)
  let filteredUsers = allUsers;

  // Fake pagination
  const totalUser = filteredUsers.length;
  const totalPages = Math.ceil(totalUser / limit);
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  return {
    data: paginatedUsers,
    pagination: {
      totalUser,
      page,
      limit,
      totalPages,
    },
  };
};

// get all users
export const useUsers = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(`/admin/users/?page=${page}&limit=${limit}`);

    return response.data;
  };

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: getData,
  });

  return { users, isLoading, isError, error, refetch };
};

// get all payments
export const useStripePayments = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(
      `/admin/stripe-payments/?page=${page}&limit=${limit}`
    );

    return response.data;
  };

  const {
    data: stripePayments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["stripePayments", page, limit],
    queryFn: getData,
  });

  return { stripePayments, isLoading, isError, error, refetch };
};

// get all admin
export const useAllAdmins = () => {
  const getData = async () => {
    const response = await API.get("/admin/administrators/");
    return response.data;
  };

  const {
    data: allAdmins = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allAdmins"],
    queryFn: getData,
  });

  return { allAdmins, isLoading, isError, error, refetch };
};

// administrators
export const getMockAdministrators = async () => {
  const response = await axios.get("/administrators_8.json");

  return response.data;
};

// get all Spa
export const useAllSpa = ({ page = 1, limit = 10, search, status }) => {
  const getData = async ({ page = 1, limit = 10 }) => {
    const res = await axios.get("/spa.json");
    const allData = res.data || [];

    // Fake pagination
    const totalPayments = allData.length;
    const totalPages = Math.ceil(totalPayments / limit);
    const paginatedPayments = allData.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedPayments,
      pagination: {
        totalPayments,
        page,
        limit,
        totalPages,
      },
    };
  };

  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allSpa", page, limit],
    queryFn: getData,
  });

  const { data: allSpa = [], pagination = {} } = response;

  return { allSpa, pagination, isLoading, isError, error, refetch };
};
// get all food-orders
export const useAllMockFoodOrders = ({ page = 1, limit = 10 }) => {
  const getData = async ({ page = 1, limit = 10 }) => {
    const res = await axios.get("/foodOrder.json");
    const allData = res.data || [];

    // Fake pagination
    const totalPayments = allData.length;
    const totalPages = Math.ceil(totalPayments / limit);
    const paginatedPayments = allData.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedPayments,
      pagination: {
        totalPayments,
        page,
        limit,
        totalPages,
      },
    };
  };

  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allMockFoodOrders", page, limit],
    queryFn: getData,
  });

  const { data: allMockFoodOrders = [], pagination = {} } = response;

  return { allMockFoodOrders, pagination, isLoading, isError, error, refetch };
};

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

// get message
export const getMockMessages = async () => {
  const response = await axios.get("/user_chat.json");

  return response.data;
};

// get previous scans
export const getMockPreviousScans = async () => {
  const response = await axios.get("/previousScans.json");

  return response.data;
};

// get Single scans
export const getMockSingleScans = async () => {
  const response = await axios.get("/singleScan.json");

  return response.data;
};

// get Saved Recipes
export const getMockSavedRecipes = async () => {
  const response = await axios.get("/recipes.json");

  return response.data;
};
