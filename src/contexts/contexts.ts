import { createContext } from "react";
import { AlertProps } from "src/types";

export type GlobalContextType = {
  setAlertProps: (alertProps: AlertProps | null) => void;
};

export const GlobalContext = createContext<GlobalContextType>({
  setAlertProps: () => {
    throw new Error("Global context is not initalized!");
  },
});
