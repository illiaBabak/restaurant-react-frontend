import { JSX } from "react";
import { useGetDishes } from "src/api/dishes";
import { ColumnDef } from "@tanstack/react-table";
import { Dish } from "src/types";
import { Plus } from "lucide-react";
import { Table } from "src/components/Table";
import { Loader } from "src/components/Loader";

const dishesColumns: ColumnDef<Dish>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Price",
    accessorKey: "price",
  },
  {
    header: "Weight",
    accessorKey: "weight",
  },
  {
    header: "Category",
    accessorKey: "category",
  },
];

export const DishesManagment = (): JSX.Element => {
  const { data: dishes, isLoading: isLoadingDishes } = useGetDishes();

  return (
    <div className="w-full px-7 pt-4">
      <div className="flex justify-between items-center flex-row my-4">
        <h2 className="text-2xl font-bold tracking-wide mb-4">Dishes</h2>

        <button className="rounded-md cursor-pointer transition-all duration-300 hover:scale-115 mb-4">
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {dishes && <Table data={dishes} columns={dishesColumns} />}
      {isLoadingDishes && <Loader />}
    </div>
  );
};
