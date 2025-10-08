import { BACKEND_URL } from "src/utils/constants";
import { Bill } from "src/types";
import { RECEIPT_CREATE_QUERY } from "./constants";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

const createBill = async (bill: Bill): Promise<Blob> => {
  const response = await fetch(`${BACKEND_URL}/bills`, {
    method: "POST",
    body: JSON.stringify(bill),
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

export const useCreateBill = (): UseMutationResult<Blob, Error, Bill> => {
  return useMutation({
    mutationKey: [RECEIPT_CREATE_QUERY],
    mutationFn: createBill,
  });
};
