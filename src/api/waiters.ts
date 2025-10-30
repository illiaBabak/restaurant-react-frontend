import {
  useMutation,
  UseMutationResult,
  useInfiniteQuery,
  useQueryClient,
  UseInfiniteQueryResult,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { NewWaiter, Waiter, PageData } from "src/types";
import { BACKEND_URL } from "src/utils/constants";
import {
  WAITERS_ADD_QUERY,
  WAITERS_GET_QUERY,
  WAITERS_UPDATE_QUERY,
  WAITERS_MUTATION,
  WAITERS_DELETE_QUERY,
  WAITERS_GET_ALL_QUERY,
} from "src/api/constants";
import { isWaitersPageResponse, isWaitersResponse } from "src/utils/guards";
import { fetchWithParams } from "src/utils/fetchWithParams";

const getWaitersByPage = async (): Promise<PageData<Waiter[]>> => {
  const response = await fetchWithParams(`${BACKEND_URL}/waiters`);

  if (!response.ok) {
    throw new Error("Failed to fetch waiters");
  }

  const result = await response.json();

  if (!isWaitersPageResponse(result)) {
    throw new Error("Invalid response");
  }

  return result.data;
};

const getAllWaiters = async (): Promise<Waiter[]> => {
  const response = await fetchWithParams(`${BACKEND_URL}/waiters/all`);

  if (!response.ok) {
    throw new Error("Failed to fetch waiters");
  }

  const result = await response.json();

  return isWaitersResponse(result) ? result.data : [];
};

const addWaiter = async (waiter: NewWaiter): Promise<void> => {
  const response = await fetchWithParams(`${BACKEND_URL}/waiters`, {
    method: "POST",
    body: JSON.stringify(waiter),
  });

  if (!response.ok) {
    throw new Error("Failed to add waiter");
  }
};

const updateWaiter = async (waiter: Waiter): Promise<void> => {
  const response = await fetchWithParams(`${BACKEND_URL}/waiters`, {
    method: "PUT",
    body: JSON.stringify(waiter),
  });

  if (!response.ok) {
    throw new Error("Failed to update waiter");
  }
};

const deleteWaiter = async (id: string): Promise<void> => {
  const response = await fetchWithParams(`${BACKEND_URL}/waiters`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete waiter");
  }
};

export const useGetWaitersByPage = (): UseInfiniteQueryResult<
  { pages: PageData<Waiter>[] },
  Error
> =>
  useInfiniteQuery({
    queryKey: [WAITERS_GET_QUERY],
    queryFn: getWaitersByPage,
    initialPageParam: 1,
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

export const useGetAllWaiters = (): UseQueryResult<Waiter[], Error> =>
  useQuery({
    queryKey: [WAITERS_GET_ALL_QUERY],
    queryFn: getAllWaiters,
  });

export const useAddWaiter = (): UseMutationResult<void, Error, NewWaiter> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [WAITERS_MUTATION, WAITERS_ADD_QUERY],
    mutationFn: addWaiter,
    onMutate: (waiter) => {
      queryClient.cancelQueries({ queryKey: [WAITERS_GET_QUERY] });

      const prevWaitersPages = queryClient.getQueryData<{
        pages: PageData<Waiter>[];
      }>([WAITERS_GET_QUERY]) ?? { pages: [] };

      const newWaitersPages = prevWaitersPages?.pages?.map((page) => {
        if (page.currentPageNumber === 1) {
          return {
            ...page,
            pageData: [waiter, ...(page.pageData ?? [])],
          };
        }

        return page;
      });

      queryClient.setQueryData([WAITERS_GET_QUERY], {
        ...prevWaitersPages,
        pages: newWaitersPages,
      });

      return { prevWaitersPages };
    },
    onSettled: () => {
      queryClient.removeQueries({ queryKey: [WAITERS_GET_QUERY] });
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_QUERY] });
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_ALL_QUERY] });
    },
    onError: (_, __, context) => {
      if (context?.prevWaitersPages) {
        queryClient.setQueryData([WAITERS_GET_QUERY], {
          pages: context.prevWaitersPages,
        });
      }
    },
  });
};

export const useUpdateWaiter = (): UseMutationResult<void, Error, Waiter> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [WAITERS_MUTATION, WAITERS_UPDATE_QUERY],
    mutationFn: updateWaiter,
    onMutate: (editedWaiter) => {
      queryClient.cancelQueries({ queryKey: [WAITERS_GET_QUERY] });

      const prevWaiters = queryClient.getQueryData<{
        pages: PageData<Waiter>[];
      }>([WAITERS_GET_QUERY]);

      const newWaitersPages = prevWaiters?.pages.map((page) => {
        return {
          ...page,
          pageData: page.pageData.map((w) =>
            w.id === editedWaiter.id ? editedWaiter : w
          ),
        };
      });

      queryClient.setQueryData([WAITERS_GET_QUERY], {
        ...prevWaiters,
        pages: newWaitersPages,
      });

      return { prevWaiters };
    },
    onError: (_, __, context) => {
      if (context?.prevWaiters) {
        queryClient.setQueryData([WAITERS_GET_QUERY], context.prevWaiters);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_QUERY] });
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_ALL_QUERY] });
    },
  });
};

export const useDeleteWaiter = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [WAITERS_MUTATION, WAITERS_DELETE_QUERY],
    mutationFn: deleteWaiter,
    onMutate: (id) => {
      queryClient.cancelQueries({ queryKey: [WAITERS_GET_QUERY] });

      const prevWaiters = queryClient.getQueryData<{
        pages: PageData<Waiter>[];
      }>([WAITERS_GET_QUERY]);

      const newWaitersPages = prevWaiters?.pages.map((page) => {
        return {
          ...page,
          pageData: page.pageData.filter((w) => w.id !== id),
        };
      });

      queryClient.setQueryData([WAITERS_GET_QUERY], {
        ...prevWaiters,
        pages: newWaitersPages,
      });

      return { prevWaiters };
    },
    onError: (_, __, context) => {
      if (context?.prevWaiters) {
        queryClient.setQueryData([WAITERS_GET_QUERY], context.prevWaiters);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_QUERY] });
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_ALL_QUERY] });
    },
  });
};
