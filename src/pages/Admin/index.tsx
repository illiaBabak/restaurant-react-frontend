import { JSX } from "react";
import { Header } from "src/components/Header";
import { SideBar } from "src/components/SideBar";
import { WaitersManagment } from "src/pages/Admin/components/WaitersManagment";
import { DishesManagment } from "src/pages/Admin/components/DishesManagment";
import { useSearchParams } from "react-router";

export const Admin = (): JSX.Element => {
  const [searchParams] = useSearchParams();

  const selectedTableCategory = searchParams.get("table-category") ?? "Waiters";

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex items-start h-full">
        <SideBar />

        {selectedTableCategory === "Waiters" && <WaitersManagment />}

        {selectedTableCategory === "Dishes" && <DishesManagment />}
      </div>
    </div>
  );
};
