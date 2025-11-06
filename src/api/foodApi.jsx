import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "./api";

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

// get all food-orders
export const useAllFoodOrders = ({ page = 1, limit = 10, status = null }) => {
  const getData = async () => {
    const response = await API.get("/food-order/all", {
      params: { page, limit, status },
    });
    return response.data;
  };

  const {
    data: allFoodOrders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allFoodOrders", page, limit, status],
    queryFn: getData,
  });

  return { allFoodOrders, isLoading, isError, error, refetch };
};

