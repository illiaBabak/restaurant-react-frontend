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

const getWaitersByPage = async (
  pageParam: number,
  search?: string
): Promise<PageData<Waiter[]>> => {
  const response = await fetchWithParams({
    apiUrl: BACKEND_URL,
    url: "waiter",
    method: "GET",
    urlParams: new URLSearchParams({
      page: pageParam.toString(),
      search: search ?? "",
    }),
  });

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
  const response = await fetchWithParams({
    apiUrl: BACKEND_URL,
    url: "waiter/all",
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch waiters");
  }

  const result = await response.json();

  return isWaitersResponse(result) ? result.data : [];
};

const addWaiter = async (waiter: NewWaiter): Promise<void> => {
  const response = await fetchWithParams({
    apiUrl: BACKEND_URL,
    url: "waiter",
    method: "POST",
    body: JSON.stringify(waiter),
  });

  if (!response.ok) {
    throw new Error("Failed to add waiter");
  }
};

const updateWaiter = async (waiter: Waiter): Promise<void> => {
  const response = await fetchWithParams({
    apiUrl: BACKEND_URL,
    url: "waiter",
    method: "PUT",
    body: JSON.stringify(waiter),
  });

  if (!response.ok) {
    throw new Error("Failed to update waiter");
  }
};

const deleteWaiter = async (id: string): Promise<void> => {
  const response = await fetchWithParams({
    apiUrl: BACKEND_URL,
    url: "waiter",
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete waiter");
  }
};

export const useGetWaitersByPage = (
  initialPage: number,
  search?: string
): UseInfiniteQueryResult<{ pages: PageData<Waiter>[] }, Error> =>
  useInfiniteQuery({
    queryKey: [WAITERS_GET_QUERY, search ?? ""],
    queryFn: ({ pageParam }) => getWaitersByPage(pageParam, search),
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

export const useGetAllWaiters = (): UseQueryResult<Waiter[], Error> =>
  useQuery({
    queryKey: [WAITERS_GET_ALL_QUERY],
    queryFn: getAllWaiters,
  });

export const useAddWaiter = (): UseMutationResult<
  void,
  Error,
  {
    waiter: NewWaiter;
    search?: string;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [WAITERS_MUTATION, WAITERS_ADD_QUERY],
    mutationFn: ({ waiter }) => addWaiter(waiter),
    onMutate: ({ waiter, search = "" }) => {
      queryClient.cancelQueries({ queryKey: [WAITERS_GET_QUERY] });

      const prevWaitersPages = queryClient.getQueryData<{
        pages: PageData<Waiter>[];
      }>([WAITERS_GET_QUERY, search ?? ""]) ?? { pages: [] };

      const newWaitersPages = prevWaitersPages?.pages?.map((page) => {
        if (page.currentPageNumber === 1) {
          return {
            ...page,
            pageData: [waiter, ...(page.pageData ?? [])],
          };
        }

        return page;
      });

      queryClient.setQueryData([WAITERS_GET_QUERY, search ?? ""], {
        ...prevWaitersPages,
        pages: newWaitersPages,
      });

      return { prevWaitersPages };
    },
    onSettled: (_, __, { search }) => {
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_QUERY, search] });
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

export const useUpdateWaiter = (): UseMutationResult<
  void,
  Error,
  {
    waiter: Waiter;
    search?: string;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [WAITERS_MUTATION, WAITERS_UPDATE_QUERY],
    mutationFn: ({ waiter }) => updateWaiter(waiter),
    onMutate: ({ waiter, search = "" }) => {
      queryClient.cancelQueries({ queryKey: [WAITERS_GET_QUERY] });

      const prevWaiters = queryClient.getQueryData<{
        pages: PageData<Waiter>[];
      }>([WAITERS_GET_QUERY, search ?? ""]);

      const newWaitersPages = prevWaiters?.pages.map((page) => {
        return {
          ...page,
          pageData: page.pageData.map((w) => (w.id === waiter.id ? waiter : w)),
        };
      });

      queryClient.setQueryData([WAITERS_GET_QUERY, search ?? ""], {
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
    onSettled: (_, __, { search }) => {
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_QUERY, search] });
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_ALL_QUERY] });
    },
  });
};

export const useDeleteWaiter = (): UseMutationResult<
  void,
  Error,
  {
    id: string;
    search?: string;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [WAITERS_MUTATION, WAITERS_DELETE_QUERY],
    mutationFn: ({ id }) => deleteWaiter(id),
    onMutate: ({ id, search = "" }) => {
      queryClient.cancelQueries({ queryKey: [WAITERS_GET_QUERY] });

      const prevWaiters = queryClient.getQueryData<{
        pages: PageData<Waiter>[];
      }>([WAITERS_GET_QUERY, search ?? ""]);

      const newWaitersPages = prevWaiters?.pages.map((page) => {
        return {
          ...page,
          pageData: page.pageData.filter((w) => w.id !== id),
        };
      });

      queryClient.setQueryData([WAITERS_GET_QUERY, search ?? ""], {
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
    onSettled: (_, __, { search }) => {
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_QUERY, search] });
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_ALL_QUERY] });
    },
  });
};
