import { JSX, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Receipt } from "src/pages/Receipt";
import { Admin } from "src/pages/Admin";
import { NotFound } from "src/pages/NotFound";
import { AlertProps } from "src/types";
import { Alert } from "src/components/Alert";
import { GlobalProvider } from "src/contexts/providers";

export const App = (): JSX.Element => {
  const [alertProps, setAlertProps] = useState<AlertProps | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const startAlertTimer = () => {
    const id = setTimeout(() => {
      setAlertProps(null);
    }, 5000);

    setTimeoutId(id);

    return id;
  };

  const handleMouseEnter = () => {
    if (!timeoutId) return;

    clearTimeout(timeoutId);
    setTimeoutId(null);
  };

  useEffect(() => {
    const id = startAlertTimer();

    return () => clearTimeout(id);
  }, [alertProps]);

  return (
    <GlobalProvider setAlertProps={setAlertProps}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>

        {alertProps && (
          <Alert
            {...alertProps}
            onClose={() => setAlertProps(null)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={startAlertTimer}
          />
        )}
      </BrowserRouter>
    </GlobalProvider>
  );
};
