import { JSX, useContext, useEffect, useMemo, useState } from "react";
import {
  useAddDish,
  useDeleteDish,
  useGetDishesByPage,
  useUpdateDish,
} from "src/api/dishes";
import { ColumnDef } from "@tanstack/react-table";
import { Dish, NewDish } from "src/types";
import { Plus, X } from "lucide-react";
import { Table } from "src/components/Table";
import { OverlayModal } from "src/components/OverlayModal";
import { FormInput } from "src/components/FormInput";
import { GlobalContext } from "src/contexts/contexts";
import { Dropdown } from "src/components/Dropdown";
import { DISHES_CATEGORIES, PRICE_FILTERS } from "src/utils/constants";
import { useSearchParams } from "react-router-dom";
import { removeUnderlines } from "src/utils/removeUnderlines";
import { useQueryClient } from "@tanstack/react-query";
import { DISHES_GET_QUERY } from "src/api/constants";

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

const EMPTY_DISH_VALUES: NewDish = {
  name: "",
  price: 0,
  weight: 0,
  category: "main",
};

export const DishesManagment = (): JSX.Element => {
  const { setAlertProps } = useContext(GlobalContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: dishesData,
    isLoading: isLoadingDishes,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useGetDishesByPage();

  const queryClient = useQueryClient();

  const dishes = useMemo(() => {
    const pageIndex = dishesData?.pages.findIndex(
      (page) => page.currentPageNumber === Number(searchParams.get("page") ?? 1)
    );
    return dishesData?.pages[pageIndex ?? 0]?.pageData ?? [];
  }, [dishesData, searchParams]);

  const pageCount = dishesData?.pages[0]?.totalPages ?? 0;

  const { mutateAsync: addDish } = useAddDish();

  const { mutateAsync: updateDish } = useUpdateDish();

  const { mutateAsync: deleteDish } = useDeleteDish();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const [newDish, setNewDish] = useState<NewDish>(EMPTY_DISH_VALUES);

  const [dishToEdit, setDishToEdit] = useState<Dish | null>(null);

  const [originalDishToEdit, setOriginalDishToEdit] = useState<Dish | null>(
    null
  );

  useEffect(() => {
    setSearchParams((prev) => {
      if (!searchParams.get("price")) prev.set("price", "all");

      if (!searchParams.get("category")) prev.set("category", "all");

      return prev;
    });
  }, [setSearchParams, searchParams]);

  const [selectedPrice, setSelectedPrice] = useState<
    keyof typeof PRICE_FILTERS
  >((searchParams.get("price") as keyof typeof PRICE_FILTERS) ?? "all");

  const [selectedCategory, setSelectedCategory] = useState<
    (typeof DISHES_CATEGORIES)[number]
  >(searchParams.get("category") ?? "all");

  useEffect(() => {
    queryClient.removeQueries({ queryKey: [DISHES_GET_QUERY] });
    queryClient.invalidateQueries({ queryKey: [DISHES_GET_QUERY] });
  }, [selectedPrice, selectedCategory, queryClient]);

  const isChangedDish =
    JSON.stringify(originalDishToEdit) !== JSON.stringify(dishToEdit);

  const closeModal = () => {
    setShouldShowModal(false);
    setNewDish(EMPTY_DISH_VALUES);
    setDishToEdit(null);
    setOriginalDishToEdit(null);
  };

  const handleCreateAndUpdateDish = async () => {
    if (
      dishToEdit
        ? !dishToEdit.name
        : !newDish.name || (dishToEdit && !isChangedDish)
    )
      return;

    if (dishToEdit ? dishToEdit.price <= 0 : newDish.price <= 0) {
      setAlertProps({
        text: "Price must be greater than 0",
        type: "error",
        position: "top",
      });
      return;
    }

    if (dishToEdit ? dishToEdit.weight <= 0 : newDish.weight <= 0) {
      setAlertProps({
        text: "Weight must be greater than 0",
        type: "error",
        position: "top",
      });
      return;
    }

    if (dishToEdit) await updateDish(dishToEdit);
    else await addDish(newDish);

    closeModal();
  };

  const handleDeleteDish = async () => {
    if (!dishToEdit) return;

    await deleteDish(dishToEdit.id);

    closeModal();
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-7 pt-3 sm:pt-4">
      <div className="flex justify-between items-center flex-row h-[65px]">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
            Dishes
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1 ms-4">
            <label className="text-sm sm:text-base">Category</label>
            <Dropdown
              options={DISHES_CATEGORIES}
              selectedOption={selectedCategory}
              setSelectedOption={(option) => {
                setSelectedCategory(option);
                setSearchParams((prev) => {
                  prev.set("category", option);
                  return prev;
                });
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1 ms-4">
            <label className="text-sm sm:text-base">Price</label>
            <Dropdown
              options={Object.keys(PRICE_FILTERS)}
              selectedOption={removeUnderlines(selectedPrice)}
              setSelectedOption={(option) => {
                setSelectedPrice(option as keyof typeof PRICE_FILTERS);
                setSearchParams((prev) => {
                  prev.set(
                    "price",
                    PRICE_FILTERS[option as keyof typeof PRICE_FILTERS]
                  );
                  return prev;
                });
              }}
            />
          </div>
        </div>

        <button
          onClick={() => setShouldShowModal(true)}
          className="rounded-md cursor-pointer transition-all duration-300 hover:scale-115 mb-3 sm:mb-4"
        >
          <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      <Table
        data={dishes ?? []}
        columns={dishesColumns}
        isLoading={
          isLoadingDishes || isFetchingNextPage || isFetchingPreviousPage
        }
        getClickedRow={(dish) => {
          setOriginalDishToEdit(dish);
          setDishToEdit(dish);
          setShouldShowModal(true);
        }}
        pageCount={pageCount}
        fetchNextPage={() => {
          const nextPageIndex =
            (dishesData?.pages.findIndex(
              (page) =>
                page.currentPageNumber === Number(searchParams.get("page") ?? 1)
            ) ?? 0) + 1;

          if (dishesData?.pages?.[nextPageIndex]?.pageData?.length) return;

          fetchNextPage();
        }}
        fetchPreviousPage={() => {
          const previousPageIndex =
            (dishesData?.pages.findIndex(
              (page) =>
                page.currentPageNumber === Number(searchParams.get("page") ?? 1)
            ) ?? 0) - 1;

          if (dishesData?.pages?.[previousPageIndex]?.pageData?.length) return;

          fetchPreviousPage();
        }}
      />

      {shouldShowModal && (
        <OverlayModal onClose={closeModal}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-4 sm:p-6 rounded-[0px] sm:rounded-lg cursor-default w-full h-full sm:w-[90%] sm:h-[90%] md:w-[75%] lg:w-[60%] xl:h-[75%] xl:w-[50%] max-w-2xl overflow-y-auto z-[40]"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold tracking-wide mb-4">
                {dishToEdit ? "Update Dish" : "Create Dish"}
              </h2>

              <button
                className="cursor-pointer mb-4 transition-all duration-300 hover:scale-115"
                onClick={closeModal}
              >
                <X className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </div>

            <form className="flex flex-col justify-between min-h-[calc(100%-4rem)]">
              <div className="flex flex-col gap-3 sm:gap-4">
                <FormInput
                  label="name"
                  placeholder="Enter name"
                  value={dishToEdit ? dishToEdit.name : newDish.name}
                  onChange={({ target: { value } }) =>
                    dishToEdit
                      ? setDishToEdit({ ...dishToEdit, name: value })
                      : setNewDish({ ...newDish, name: value })
                  }
                  type="text"
                />
                <FormInput
                  label="price"
                  placeholder="Enter price"
                  value={
                    dishToEdit
                      ? dishToEdit.price.toString()
                      : newDish.price.toString()
                  }
                  onChange={({ target: { value } }) =>
                    dishToEdit
                      ? setDishToEdit({ ...dishToEdit, price: Number(value) })
                      : setNewDish({ ...newDish, price: Number(value) })
                  }
                  type="number"
                />
                <FormInput
                  label="weight"
                  placeholder="Enter weight"
                  value={
                    dishToEdit
                      ? dishToEdit.weight.toString()
                      : newDish.weight.toString()
                  }
                  onChange={({ target: { value } }) =>
                    dishToEdit
                      ? setDishToEdit({ ...dishToEdit, weight: Number(value) })
                      : setNewDish({ ...newDish, weight: Number(value) })
                  }
                  type="number"
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <label className="text-sm sm:text-base">Category</label>
                  <Dropdown
                    options={DISHES_CATEGORIES}
                    selectedOption={
                      dishToEdit ? dishToEdit.category : newDish.category
                    }
                    setSelectedOption={(option) =>
                      dishToEdit
                        ? setDishToEdit({ ...dishToEdit, category: option })
                        : setNewDish({ ...newDish, category: option })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-2 w-full flex-col mt-4">
                <div className="flex items-center justify-center flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-[80%]">
                  <button
                    className={`${
                      (
                        isChangedDish && dishToEdit
                          ? dishToEdit.name.length
                          : newDish.name.length
                      )
                        ? "bg-violet-500 cursor-pointer transition-all duration-300 hover:scale-105"
                        : "bg-gray-500/50 cursor-not-allowed"
                    } w-full text-white rounded-md p-2 sm:p-2.5 text-sm sm:text-base`}
                    type="button"
                    onClick={handleCreateAndUpdateDish}
                  >
                    {dishToEdit ? "Update" : "Create"}
                  </button>

                  {!!dishToEdit && (
                    <button
                      className={`cursor-pointer w-full bg-red-500 text-white rounded-md p-2 sm:p-2.5 transition-all duration-300 hover:scale-105 text-sm sm:text-base`}
                      type="button"
                      onClick={handleDeleteDish}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <button
                  className="cursor-pointer w-full sm:w-[80%] bg-rose-500 text-white rounded-md p-2 sm:p-2.5 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  type="button"
                  onClick={closeModal}
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
