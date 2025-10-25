import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "./api";

// food
export const useMockFoods = ({
  page = 1,
  limit = 10,
  food_name = null,
  status = null,
}) => {
  const getData = async () => {
    const response = await axios.get("/foods.json");

    let filteredData = response.data;

    if (food_name && food_name.trim() !== "") {
      filteredData = filteredData.filter((item) =>
        item.food_name?.toLowerCase().includes(food_name.toLowerCase())
      );
    }

    if (status) {
      filteredData = filteredData.filter((item) => item.status === status);
    }

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);

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
    queryKey: ["mockFoods", page, limit, food_name, status],
    queryFn: getData,
    keepPreviousData: true,
  });

  const { data: mockFoods = [], pagination = {} } = response;

  return { mockFoods, pagination, isLoading, isError, error, refetch };
};

export const useFoods = ({
  page = 1,
  limit = 10,
  food_name = null,
  status = null,
}) => {
  const getData = async () => {
    const response = await API.get("/food/admin", {
      params: { page, limit, food_name, status },
    });
    return response.data.data;
  };

  const {
    data: allFoods = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allFoods", page, limit, food_name, status],
    queryFn: getData,
  });

  return { allFoods, isLoading, isError, error, refetch };
};

// category
export const useMockCategory = (params) => {
  const getData = async () => {
    const response = await API.get("/food-category/all", { params });
    return response.data.data;
  };

  const {
    data: mockCategory = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mockCategory", params],
    queryFn: getData,
  });

  return { mockCategory, isLoading, isError, error, refetch };
};


// ingrediants
export const useIngredients = (params) => {
  const getData = async () => {
    const response = await API.get("/food-ingredient/all", { params });
    return response.data.data;
  };

  const {
    data: ingredients = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ingredients", params],
    queryFn: getData,
  });

  return { ingredients, isLoading, isError, error, refetch };
};
