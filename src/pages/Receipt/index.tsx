import { JSX, useContext, useEffect, useState } from "react";
import { Header } from "src/components/Header";
import { useGetDishes } from "src/api/dishes";
import { useGetWaiters } from "src/api/waiters";
import { Dropdown } from "src/components/Dropdown";
import { Waiter } from "src/types";
import { Loader } from "src/components/Loader";
import { useCreateBill } from "src/api/bills";
import { GlobalContext } from "src/root";

export const Receipt = (): JSX.Element => {
  const { setAlertProps } = useContext(GlobalContext);

  const { data: dishes, isLoading: isLoadingDishes } = useGetDishes();

  const { data: waiters, isLoading: isLoadingWaiters } = useGetWaiters();

  const { mutateAsync: createBill } = useCreateBill();

  const [selectedWaiter, setSelectedWaiter] = useState<Waiter | null>(null);

  const [selectedDishes, setSelectedDishes] = useState<
    {
      dish_id: string;
      quantity: number;
    }[]
  >([]);

  useEffect(() => {
    if (waiters?.length) setSelectedWaiter(waiters[0]);
  }, [waiters]);

  const handleCreateBill = async () => {
    if (!selectedDishes.length) {
      setAlertProps({
        text: "Please select at least one dish",
        type: "error",
        position: "top",
      });
      return;
    }

    const blob = await createBill({
      created_at: new Date().toISOString(),
      waiter_id: selectedWaiter?.id ?? "",
      dishes: selectedDishes,
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bill.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Header />
      <div className="flex p-4 flex-col gap-4 w-full">
        <div className="flex sm:flex-row flex-col items-center justify-between w-full mt-1">
          <div className="flex flex-row gap-4 items-center">
            <h2>Waiter</h2>
            <Dropdown
              options={waiters?.map((waiter) => waiter.name) ?? []}
              selectedOption={selectedWaiter?.name ?? ""}
              setSelectedOption={(option) => {
                setSelectedWaiter(
                  waiters?.find((waiter) => waiter.name === option) ?? null
                );
              }}
            />
          </div>

          <button
            className="bg-yellow-600 sm:mt-0 mt-4 text-white px-4 py-2 rounded-md cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={handleCreateBill}
          >
            Create Bill
          </button>
        </div>

        <div className="grid lg:grid-cols-5 grid-cols-2 gap-6 mt-1">
          {dishes?.map((dish) => (
            <div
              className="bg-violet-500 text-white md:p-3 p-1 rounded-md flex flex-col gap-2 text-center justify-center md:justify-start items-center md:h-[200px] h-[160px]"
              key={`${dish.id}-${dish.name}-dish`}
            >
              <h2 className="text-base md:text-xl font-bold">{dish.name}</h2>
              <i className="text-[10px] md:text-sm">
                Category: {dish.category}
              </i>
              <i className="text-[10px] md:text-sm">Price: {dish.price}$</i>
              <i className="text-[10px] md:text-sm">Weight: {dish.weight}g</i>

              <div className="flex flex-row items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedDishes((prev) => {
                      const existingDish = prev.find(
                        (d) => d.dish_id === dish.id
                      );

                      if (!existingDish) return prev;

                      if (existingDish.quantity <= 1)
                        return prev.filter((d) => d.dish_id !== dish.id);

                      return prev.map((d) =>
                        d.dish_id === dish.id
                          ? { ...d, quantity: d.quantity - 1 }
                          : d
                      );
                    });
                  }}
                  className={`font-bold text-2xl w-[14px] cursor-pointer ${
                    selectedDishes.find((d) => d.dish_id === dish.id)
                      ?.quantity === 0 ||
                    !selectedDishes.find((d) => d.dish_id === dish.id)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  -
                </button>
                <p className="p-0 m-0 text-xl md:text-2xl">
                  {selectedDishes.find((d) => d.dish_id === dish.id)
                    ?.quantity ?? 0}
                </p>
                <button
                  onClick={() => {
                    setSelectedDishes((prev) => {
                      const existingDish = prev.find(
                        (d) => d.dish_id === dish.id
                      );

                      if (existingDish) {
                        return prev.map((d) =>
                          d.dish_id === dish.id
                            ? { ...d, quantity: d.quantity + 1 }
                            : d
                        );
                      } else {
                        return [...prev, { dish_id: dish.id, quantity: 1 }];
                      }
                    });
                  }}
                  className="font-bold text-2xl w-[14px] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {isLoadingDishes || (isLoadingWaiters && <Loader />)}
      </div>
    </div>
  );
};
