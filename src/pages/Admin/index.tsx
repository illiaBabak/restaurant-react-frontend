import { JSX } from "react";
import { Header } from "src/components/Header";
import { SideBar } from "src/components/SideBar";
import { useGetWaiters } from "src/api/waiters";

export const Admin = (): JSX.Element => {
  const { data: waiters } = useGetWaiters();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <SideBar />
    </div>
  );
};
