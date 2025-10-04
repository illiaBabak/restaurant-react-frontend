import { Dish } from "src/types";
import { DISHES_GET_QUERY } from "./constants";
import { BACKEND_URL } from "src/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { isDishesResponse } from "src/utils/guards";

export const getDishes = async (): Promise<Dish[]> => {
  const response = await fetch(`${BACKEND_URL}/dishes`);

  if (!response.ok) {
    throw new Error("Failed to fetch dishes");
  }

  const result = await response.json();

  return isDishesResponse(result) ? result.data : [];
};

export const useGetDishes = () =>
  useQuery({
    queryKey: [DISHES_GET_QUERY],
    queryFn: getDishes,
  });
