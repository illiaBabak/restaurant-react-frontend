import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Waiter } from "src/types";
import { BACKEND_URL } from "src/utils/constants";
import {
  WAITERS_ADD_QUERY,
  WAITERS_GET_QUERY,
  WAITERS_MUTATION,
} from "src/api/constants";
import { isWaitersResponse } from "src/utils/guards";

const getWaiters = async (): Promise<Waiter[]> => {
  const response = await fetch(`${BACKEND_URL}/waiters`);

  if (!response.ok) {
    throw new Error("Failed to fetch waiters");
  }

  const result = await response.json();

  return isWaitersResponse(result) ? result.data : [];
};

const addWaiter = async (waiter: Waiter): Promise<void> => {
  const response = await fetch(`${BACKEND_URL}/waiters`, {
    method: "POST",
    body: JSON.stringify(waiter),
  });

  if (!response.ok) {
    throw new Error("Failed to add waiter");
  }
};

export const useGetWaiters = () =>
  useQuery({
    queryKey: [WAITERS_GET_QUERY],
    queryFn: getWaiters,
  });

export const useAddWaiter = (): UseMutationResult<void, Error, Waiter> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [WAITERS_MUTATION, WAITERS_ADD_QUERY],
    mutationFn: addWaiter,
    onMutate: (waiter) => {
      queryClient.cancelQueries({ queryKey: [WAITERS_GET_QUERY] });

      const prevWaiters =
        queryClient.getQueryData<Waiter[]>([WAITERS_GET_QUERY]) ?? [];

      queryClient.setQueryData([WAITERS_GET_QUERY], [...prevWaiters, waiter]);

      return { prevWaiters };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [WAITERS_GET_QUERY] });
    },
  });
};
