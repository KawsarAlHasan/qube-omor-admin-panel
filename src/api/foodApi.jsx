import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// food
export const useMockFoods = ({ page = 1, limit = 10, food_name = null, status = null }) => {
  const getData = async () => {
    const response = await axios.get("/foods.json");

    // প্রথমে সব ডাটা ফিল্টার করুন
    let filteredData = response.data;

    // food_name দ্বারা ফিল্টার করুন (case insensitive)
    if (food_name && food_name.trim() !== "") {
      filteredData = filteredData.filter(item =>
        item.food_name?.toLowerCase().includes(food_name.toLowerCase())
      );
    }

    // status দ্বারা ফিল্টার করুন
    if (status) {
      filteredData = filteredData.filter(item => item.status === status);
    }

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);

    // ফিল্টার করা ডাটা থেকে পেজিনেশন প্রয়োগ করুন
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedData,
      pagination: {
        totalItems,
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
    queryKey: ["mockFoods", page, limit, food_name, status], // ফিল্টার প্যারামিটার যোগ করুন
    queryFn: getData,
    keepPreviousData: true,
  });

  const { data: mockFoods = [], pagination = {} } = response;

  return { mockFoods, pagination, isLoading, isError, error, refetch };
};

// category
export const useMockCategory = () => {
  const getData = async () => {
    const response = await axios.get("/foodCategory.json");
    return response.data;
  };

  const {
    data: mockCategory = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mockCategory"],
    queryFn: getData,
  });

  return { mockCategory, isLoading, isError, error, refetch };
};

// ingrediants
export const useMockIngredients = () => {
  const getData = async () => {
    const response = await axios.get("/ingrediants.json");
    return response.data;
  };

  const {
    data: mockIngredients = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mockIngredients"],
    queryFn: getData,
  });

  return { mockIngredients, isLoading, isError, error, refetch };
};
