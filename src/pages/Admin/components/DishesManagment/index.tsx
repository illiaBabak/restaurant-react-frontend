import { JSX, useContext, useEffect, useState } from "react";
import {
  useAddDish,
  useDeleteDish,
  useGetDishes,
  useUpdateDish,
} from "src/api/dishes";
import { ColumnDef } from "@tanstack/react-table";
import { Dish } from "src/types";
import { Plus, X } from "lucide-react";
import { Table } from "src/components/Table";
import { v4 as uuidv4 } from "uuid";
import { OverlayModal } from "src/components/OverlayModal";
import { FormInput } from "src/components/FormInput";
import { GlobalContext } from "src/root";
import { Dropdown } from "src/components/Dropdown";
import { DISHES_CATEGORIES } from "src/utils/constants";

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
  const { setAlertProps } = useContext(GlobalContext);

  const { data: dishes, isLoading: isLoadingDishes } = useGetDishes();

  const { mutateAsync: addDish } = useAddDish();

  const { mutateAsync: updateDish } = useUpdateDish();

  const { mutateAsync: deleteDish } = useDeleteDish();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const [newDish, setNewDish] = useState<Dish>({
    id: uuidv4(),
    name: "",
    price: 0,
    weight: 0,
    category: "main",
  });

  useEffect(() => {
    if (selectedDish) {
      setNewDish(selectedDish);
      setShouldShowModal(true);
    }
  }, [selectedDish, setNewDish, setShouldShowModal]);

  useEffect(() => {
    if (shouldShowModal) return;

    setNewDish({
      id: uuidv4(),
      name: "",
      price: 0,
      weight: 0,
      category: "main",
    });

    setSelectedDish(null);
  }, [shouldShowModal, setNewDish, setSelectedDish]);

  const handleCreateDish = async () => {
    if (!newDish.name) return;

    if (newDish.price <= 0) {
      setAlertProps({
        text: "Price must be greater than 0",
        type: "error",
        position: "top",
      });
      return;
    }

    if (newDish.weight <= 0) {
      setAlertProps({
        text: "Weight must be greater than 0",
        type: "error",
        position: "top",
      });
      return;
    }

    if (selectedDish) {
      await updateDish(newDish);
    } else {
      await addDish(newDish);
    }

    setShouldShowModal(false);
  };

  const handleDeleteDish = async () => {
    if (!selectedDish) return;

    await deleteDish(selectedDish.id);

    setShouldShowModal(false);
    setSelectedDish(null);
  };

  return (
    <div className="w-full px-7 pt-4">
      <div className="flex justify-between items-center flex-row my-4">
        <h2 className="text-2xl font-bold tracking-wide mb-4">Dishes</h2>

        <button
          onClick={() => setShouldShowModal(true)}
          className="rounded-md cursor-pointer transition-all duration-300 hover:scale-115 mb-4"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      <Table
        data={dishes ?? []}
        columns={dishesColumns}
        isLoading={isLoadingDishes}
        onRowClick={(dish) => setSelectedDish(dish)}
      />

      {shouldShowModal && (
        <OverlayModal onClose={() => setShouldShowModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-4 rounded-lg cursor-default w-[50%] h-[65%]"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-wide mb-4">
                {selectedDish ? "Update Dish" : "Create Dish"}
              </h2>

              <button
                className="cursor-pointer mb-4 transition-all duration-300 hover:scale-115"
                onClick={() => setShouldShowModal(false)}
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <form className="flex flex-col justify-between h-[90%]">
              <div className="flex flex-col gap-4">
                <FormInput
                  label="name"
                  placeholder="Enter name"
                  value={newDish.name}
                  onChange={({ target: { value } }) =>
                    setNewDish({ ...newDish, name: value })
                  }
                  type="text"
                />
                <FormInput
                  label="price"
                  placeholder="Enter price"
                  value={newDish.price.toString()}
                  onChange={({ target: { value } }) =>
                    setNewDish({ ...newDish, price: Number(value) })
                  }
                  type="number"
                />
                <FormInput
                  label="weight"
                  placeholder="Enter weight"
                  value={newDish.weight.toString()}
                  onChange={({ target: { value } }) =>
                    setNewDish({ ...newDish, weight: Number(value) })
                  }
                  type="number"
                />
                <div className="flex flex-row items-center gap-2">
                  <label>Category</label>
                  <Dropdown
                    options={DISHES_CATEGORIES}
                    selectedOption={newDish.category}
                    setSelectedOption={(option) =>
                      setNewDish({ ...newDish, category: option })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 w-full flex-col">
                <div className="flex items-center justify-center flex-row gap-4 w-[80%]">
                  <button
                    className={`${
                      newDish.name.length
                        ? "bg-violet-500 cursor-pointer transition-all duration-300 hover:scale-105"
                        : "bg-gray-500/50 cursor-not-allowed"
                    } w-full text-white rounded-md p-2`}
                    type="button"
                    onClick={handleCreateDish}
                  >
                    {selectedDish ? "Update" : "Create"}
                  </button>

                  {!!selectedDish && (
                    <button
                      className={`cursor-pointer w-full bg-red-500 text-white rounded-md p-2 transition-all duration-300 hover:scale-105`}
                      type="button"
                      onClick={handleDeleteDish}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <button
                  className="cursor-pointer w-[80%] bg-rose-500 text-white rounded-md p-2 transition-all duration-300 hover:scale-105"
                  type="button"
                  onClick={() => setShouldShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </OverlayModal>
      )}
    </div>
  );
};
