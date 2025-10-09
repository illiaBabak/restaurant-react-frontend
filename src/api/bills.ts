import { BACKEND_URL } from "src/utils/constants";
import { NewBill } from "src/types";
import { BILLS_CREATE_QUERY } from "./constants";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

const createBill = async (bill: NewBill): Promise<Blob> => {
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

export const useCreateBill = (): UseMutationResult<Blob, Error, NewBill> => {
  return useMutation({
    mutationKey: [BILLS_CREATE_QUERY],
    mutationFn: createBill,
  });
};
