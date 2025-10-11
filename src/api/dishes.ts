import { Dish, NewDish } from "src/types";
import {
  DISHES_ADD_QUERY,
  DISHES_DELETE_QUERY,
  DISHES_GET_QUERY,
  DISHES_MUTATION,
  DISHES_UPDATE_QUERY,
} from "./constants";
import { BACKEND_URL } from "src/utils/constants";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { isDishesResponse } from "src/utils/guards";
import { fetchWithParams } from "src/utils/fetchWithParams";

const getDishes = async (): Promise<Dish[]> => {
  const response = await fetchWithParams(`${BACKEND_URL}/dishes`);

  if (!response.ok) {
    throw new Error("Failed to fetch dishes");
  }

  const result = await response.json();

  return isDishesResponse(result) ? result.data : [];
};

const addDish = async (dish: NewDish): Promise<void> => {
  const response = await fetchWithParams(`${BACKEND_URL}/dishes`, {
    method: "POST",
    body: JSON.stringify(dish),
  });

  if (!response.ok) {
    throw new Error("Failed to add dish");
  }
};

const updateDish = async (dish: Dish): Promise<void> => {
  const response = await fetchWithParams(`${BACKEND_URL}/dishes`, {
    method: "PUT",
    body: JSON.stringify(dish),
  });

  if (!response.ok) {
    throw new Error("Failed to update dish");
  }
};

const deleteDish = async (id: string): Promise<void> => {
  const response = await fetchWithParams(`${BACKEND_URL}/dishes`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete dish");
  }
};

export const useGetDishes = (options?: Partial<UseQueryOptions<Dish[]>>) =>
  useQuery({
    queryKey: [DISHES_GET_QUERY],
    queryFn: getDishes,
    ...options,
  });

export const useAddDish = (): UseMutationResult<void, Error, NewDish> => {
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
    onError: (_, __, context) => {
      if (context?.prevDishes) {
        queryClient.setQueryData([DISHES_GET_QUERY], context.prevDishes);
      }
    },
  });
};

export const useUpdateDish = (): UseMutationResult<void, Error, Dish> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DISHES_MUTATION, DISHES_UPDATE_QUERY],
    mutationFn: updateDish,
    onMutate: (dish) => {
      queryClient.cancelQueries({ queryKey: [DISHES_GET_QUERY] });

      const prevDishes =
        queryClient.getQueryData<Dish[]>([DISHES_GET_QUERY]) ?? [];

      queryClient.setQueryData(
        [DISHES_GET_QUERY],
        prevDishes.map((d) => (d.id === dish.id ? dish : d))
      );

      return { prevDishes };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [DISHES_GET_QUERY] });
    },
    onError: (_, __, context) => {
      if (context?.prevDishes) {
        queryClient.setQueryData([DISHES_GET_QUERY], context.prevDishes);
      }
    },
  });
};

export const useDeleteDish = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DISHES_MUTATION, DISHES_DELETE_QUERY],
    mutationFn: deleteDish,
    onMutate: (id) => {
      queryClient.cancelQueries({ queryKey: [DISHES_GET_QUERY] });

      const prevDishes =
        queryClient.getQueryData<Dish[]>([DISHES_GET_QUERY]) ?? [];

      queryClient.setQueryData(
        [DISHES_GET_QUERY],
        prevDishes.filter((d) => d.id !== id)
      );

      return { prevDishes };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [DISHES_GET_QUERY] });
    },
    onError: (_, __, context) => {
      if (context?.prevDishes) {
        queryClient.setQueryData([DISHES_GET_QUERY], context.prevDishes);
      }
    },
  });
};
