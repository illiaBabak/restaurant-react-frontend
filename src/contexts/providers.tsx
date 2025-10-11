import { AlertProps } from "src/types";
import { GlobalContext } from "./contexts";
import { ReactNode } from "react";

type GlobalProviderProps = {
  children: ReactNode;
  setAlertProps: (alertProps: AlertProps | null) => void;
};

export const GlobalProvider = ({
  children,
  setAlertProps,
}: GlobalProviderProps) => (
  <GlobalContext.Provider value={{ setAlertProps }}>
    {children}
  </GlobalContext.Provider>
);
