import { useQuery } from "@tanstack/react-query";
import { Waiter } from "src/types";
import { BACKEND_URL } from "src/utils/constants";
import { WAITERS_GET_QUERY } from "src/api/constants";
import { isWaitersResponse } from "src/utils/guards";

const getWaiters = async (): Promise<Waiter[]> => {
  const response = await fetch(`${BACKEND_URL}/waiters`);

  if (!response.ok) {
    throw new Error("Failed to fetch waiters");
  }

  const result = await response.json();

  return isWaitersResponse(result) ? result.data : [];
};

export const useGetWaiters = () =>
  useQuery({
    queryKey: [WAITERS_GET_QUERY],
    queryFn: getWaiters,
  });
