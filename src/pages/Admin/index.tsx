import { JSX } from "react";
import { Header } from "src/components/Header";
import { SideBar } from "src/components/SideBar";
import { useGetWaiters } from "src/api/waiters";
import { Loader } from "src/components/Loader";
import { Table } from "src/components/Table";

export const Admin = (): JSX.Element => {
  const { data: waiters, isLoading: isLoadingWaiters } = useGetWaiters();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <SideBar />
      {isLoadingWaiters && <Loader />}
    </div>
  );
};
