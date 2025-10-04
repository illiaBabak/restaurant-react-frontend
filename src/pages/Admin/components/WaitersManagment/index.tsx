import { JSX } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Waiter } from "src/types";
import { useGetWaiters } from "src/api/waiters";
import { Plus } from "lucide-react";
import { Table } from "src/components/Table";
import { Loader } from "src/components/Loader";

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

export const WaitersManagment = (): JSX.Element => {
  const { data: waiters, isLoading: isLoadingWaiters } = useGetWaiters();

  return (
    <div className="w-full px-7 pt-4">
      <div className="flex justify-between items-center flex-row my-4">
        <h2 className="text-2xl font-bold tracking-wide mb-4">Waiters</h2>

        <button className="rounded-md cursor-pointer transition-all duration-300 hover:scale-115 mb-4">
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {waiters && <Table data={waiters} columns={waitersColumns} />}
      {isLoadingWaiters && <Loader />}
    </div>
  );
};
