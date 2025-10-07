import { Dish } from "src/types";
import {
  DISHES_ADD_QUERY,
  DISHES_GET_QUERY,
  DISHES_MUTATION,
} from "./constants";
import { BACKEND_URL } from "src/utils/constants";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { isDishesResponse } from "src/utils/guards";

const getDishes = async (): Promise<Dish[]> => {
  const response = await fetch(`${BACKEND_URL}/dishes`);

  if (!response.ok) {
    throw new Error("Failed to fetch dishes");
  }

  const result = await response.json();

  return isDishesResponse(result) ? result.data : [];
};

const addDish = async (dish: Dish): Promise<void> => {
  const response = await fetch(`${BACKEND_URL}/dishes`, {
    method: "POST",
    body: JSON.stringify(dish),
  });

  if (!response.ok) {
    throw new Error("Failed to add dish");
  }
};

export const useGetDishes = () =>
  useQuery({
    queryKey: [DISHES_GET_QUERY],
    queryFn: getDishes,
  });

export const useAddDish = (): UseMutationResult<void, Error, Dish> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DISHES_MUTATION, DISHES_ADD_QUERY],
    mutationFn: addDish,
    onMutate: (dish) => {
      queryClient.cancelQueries({ queryKey: [DISHES_GET_QUERY] });

      const prevDishes =
        queryClient.getQueryData<Dish[]>([DISHES_GET_QUERY]) ?? [];

      queryClient.setQueryData([DISHES_GET_QUERY], [...prevDishes, dish]);

      return { prevDishes };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [DISHES_GET_QUERY] });
    },
  });
};
