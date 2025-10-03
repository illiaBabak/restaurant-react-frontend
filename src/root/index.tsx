import { JSX } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Receipt } from "src/pages/Receipt";
import { Admin } from "src/pages/Admin";
import { NotFound } from "src/pages/NotFound";

export const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
