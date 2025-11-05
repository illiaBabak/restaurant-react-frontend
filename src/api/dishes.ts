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
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { isDishesPageResponse } from "src/utils/guards";
import { fetchWithParams } from "src/utils/fetchWithParams";
import { PageData } from "src/types";

const getDishesByPage = async (
  pageParam: number,
  category: string,
  price: string,
  search?: string
): Promise<PageData<Dish[]>> => {
  const response = await fetchWithParams({
    apiUrl: BACKEND_URL,
    url: "dish",
    method: "GET",
    urlParams: new URLSearchParams({
      page: pageParam.toString(),
      category,
      price,
      search: search ?? "",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dishes");
  }

  const result = await response.json();

  if (!isDishesPageResponse(result)) {
    throw new Error("Invalid response");
  }

  return result.data;
};

const addDish = async (dish: NewDish): Promise<void> => {
  const response = await fetchWithParams({
    apiUrl: BACKEND_URL,
    url: "dish",
    method: "POST",
    body: JSON.stringify(dish),
  });

  if (!response.ok) {
    throw new Error("Failed to add dish");
  }
};

const updateDish = async (dish: Dish): Promise<void> => {
  const response = await fetchWithParams({
    apiUrl: BACKEND_URL,
    url: "dish",
    method: "PUT",
    body: JSON.stringify(dish),
  });

  if (!response.ok) {
    throw new Error("Failed to update dish");
  }
};

const deleteDish = async (id: string): Promise<void> => {
  const response = await fetchWithParams({
    apiUrl: BACKEND_URL,
    url: "dish",
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete dish");
  }
};

export const useGetDishesByPage = (
  category: string,
  price: string,
  initialPage: number,
  search?: string
): UseInfiniteQueryResult<
  {
    pages: PageData<Dish>[];
  },
  Error
> =>
  useInfiniteQuery({
    queryKey: [DISHES_GET_QUERY, category, price, search],
    queryFn: ({ pageParam }) =>
      getDishesByPage(pageParam, category, price, search),
    initialPageParam: initialPage || 1,
    getNextPageParam: ({ currentPageNumber, totalPages }) => {
      return currentPageNumber < totalPages ? currentPageNumber + 1 : undefined;
    },
    getPreviousPageParam: ({ currentPageNumber }) => {
      return currentPageNumber > 1 ? currentPageNumber - 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60, // 1 minute
  });

export const useAddDish = (): UseMutationResult<void, Error, NewDish> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DISHES_MUTATION, DISHES_ADD_QUERY],
    mutationFn: addDish,
    onMutate: (dish) => {
      queryClient.cancelQueries({ queryKey: [DISHES_GET_QUERY] });

      const prevDishes = queryClient.getQueryData<{ pages: PageData<Dish>[] }>([
        DISHES_GET_QUERY,
      ]) ?? { pages: [] };

      const newDishesPages = prevDishes?.pages?.map((page) => {
        if (page.currentPageNumber === 1) {
          return {
            ...page,
            pageData: [dish, ...(page.pageData ?? [])],
          };
        }
        return page;
      });

      queryClient.setQueryData([DISHES_GET_QUERY], {
        ...prevDishes,
        pages: newDishesPages,
      });

      return { prevDishes };
    },
    onSettled: () => {
      queryClient.removeQueries({ queryKey: [DISHES_GET_QUERY] });
      queryClient.invalidateQueries({ queryKey: [DISHES_GET_QUERY] });
    },
    onError: (_, __, context) => {
      if (context?.prevDishes) {
        queryClient.setQueryData([DISHES_GET_QUERY], {
          pages: context.prevDishes,
        });
      }
    },
  });
};

export const useUpdateDish = (): UseMutationResult<void, Error, Dish> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DISHES_MUTATION, DISHES_UPDATE_QUERY],
    mutationFn: updateDish,
    onMutate: (editedDish) => {
      queryClient.cancelQueries({ queryKey: [DISHES_GET_QUERY] });

      const prevDishes = queryClient.getQueryData<{ pages: PageData<Dish>[] }>([
        DISHES_GET_QUERY,
      ]) ?? { pages: [] };

      const newDishesPages = prevDishes?.pages.map((page) => {
        return {
          ...page,
          pageData: page.pageData.map((d) =>
            d.id === editedDish.id ? editedDish : d
          ),
        };
      });

      queryClient.setQueryData([DISHES_GET_QUERY], {
        ...prevDishes,
        pages: newDishesPages,
      });

      return { prevDishes };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [DISHES_GET_QUERY] });
    },
    onError: (_, __, context) => {
      if (context?.prevDishes) {
        queryClient.setQueryData([DISHES_GET_QUERY], {
          pages: context.prevDishes,
        });
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

      const prevDishes = queryClient.getQueryData<{ pages: PageData<Dish>[] }>([
        DISHES_GET_QUERY,
      ]);

      const newDishesPages = prevDishes?.pages.map((page) => {
        return {
          ...page,
          pageData: page.pageData.filter((d) => d.id !== id),
        };
      });

      queryClient.setQueryData([DISHES_GET_QUERY], {
        ...prevDishes,
        pages: newDishesPages,
      });

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
