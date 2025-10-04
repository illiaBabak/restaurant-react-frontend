import { JSX } from "react";
import { Header } from "src/components/Header";
import { SideBar } from "src/components/SideBar";
import { useGetWaiters } from "src/api/waiters";
import { Loader } from "src/components/Loader";
import { Table } from "src/components/Table";
import { Waiter } from "src/types";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "react-router";

const waitersColumns: ColumnDef<Waiter>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Surname",
    accessorKey: "surname",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Phone Number",
    accessorKey: "phone_number",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
];

export const Admin = (): JSX.Element => {
  const { data: waiters, isLoading: isLoadingWaiters } = useGetWaiters();

  const [searchParams] = useSearchParams();

  const selectedTable = searchParams.get("table") ?? "Waiters";

  const isWaitersTable = selectedTable === "Waiters";

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex items-start h-full">
        <SideBar />
        <div className="w-full px-7 pt-4">
          <h2 className="text-2xl font-bold tracking-wide mb-4">
            {selectedTable}
          </h2>

          {isWaitersTable && waiters && (
            <Table data={waiters} columns={waitersColumns} />
          )}
        </div>
      </div>
      {isLoadingWaiters && <Loader />}
    </div>
  );
};
