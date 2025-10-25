import { useQuery } from "@tanstack/react-query";
import { getMockSavedRecipes } from "../api/api";

export const useSavedRecipes = (options = {}) => {
  const {
    data: savedRecipesData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["savedRecipesData"],
    queryFn: getMockSavedRecipes,
    enabled: options.enabled ?? true,
  });

  return { savedRecipesData, isLoading, isError, error, refetch };
};
