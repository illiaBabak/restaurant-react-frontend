import { BACKEND_URL } from "src/utils/constants";
import { Bill, Waiter } from "src/types";
import { BILLS_CREATE_QUERY } from "./constants";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { fetchWithParams } from "src/utils/fetchWithParams";

const createBill = async (bill: Bill, waiter: Waiter): Promise<Blob> => {
  const response = await fetchWithParams({
    apiUrl: BACKEND_URL,
    url: "bill",
    method: "POST",
    body: JSON.stringify({
      bill: bill,
      waiter: waiter,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create bill");
  }

  const blob = await response.blob();

  if (!blob.size) {
    throw new Error("Failed to create bill");
  }

  return blob;
};

export const useCreateBill = (): UseMutationResult<
  Blob,
  Error,
  { bill: Bill; waiter: Waiter }
> => {
  return useMutation({
    mutationKey: [BILLS_CREATE_QUERY],
    mutationFn: ({ bill, waiter }) => createBill(bill, waiter),
  });
};
