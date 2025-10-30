import {
  JSX,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { Header } from "src/components/Header";
import { useGetDishesByPage } from "src/api/dishes";
import { useGetAllWaiters } from "src/api/waiters";
import { Dropdown } from "src/components/Dropdown";
import { Waiter } from "src/types";
import { Loader } from "src/components/Loader";
import { useCreateBill } from "src/api/bills";
import { GlobalContext } from "src/contexts/contexts";
import { useSearchParams } from "react-router-dom";

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 0,
};

export const Receipt = (): JSX.Element => {
  const { setAlertProps } = useContext(GlobalContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const init = useRef(true);

  // fix ?page=N to ?page=1 after reload
  useEffect(() => {
    if (!init.current) return;
    init.current = false;

    setSearchParams({ page: "1" }, { replace: true });
  }, [setSearchParams]);

  const {
    data: dishesData,
    isLoading: isLoadingDishes,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetDishesByPage();

  // set page to last page after fetching all pages on table route
  useLayoutEffect(() => {
    if (!init.current) return;

    if (dishesData?.pages.length) {
      init.current = false;
      const lastPageIndex = dishesData?.pages.length;

      setSearchParams(
        (prev) => {
          prev.set("page", lastPageIndex.toString());
          return prev;
        },
        { replace: true }
      );
    }
  }, [dishesData, setSearchParams]);

  const dishes = useMemo(
    () => dishesData?.pages.flatMap((page) => page.pageData) ?? [],
    [dishesData]
  );

  const { data: waiters, isLoading: isLoadingWaiters } = useGetAllWaiters();

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
      createdAt: new Date().toISOString(),
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

  const observer = useRef<IntersectionObserver | null>(null);

  const handleIntersect = (el: HTMLElement | null) => {
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }

    observer.current = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;

      const total = dishesData?.pages[0]?.totalPages ?? 0;
      const current = Number(searchParams.get("page") ?? 1);

      if (current < total) {
        setSearchParams((prev) => {
          prev.set("page", (Number(prev.get("page") ?? 1) + 1).toString());
          return prev;
        });

        fetchNextPage();
      }
    }, OBSERVER_OPTIONS);

    if (el) observer.current.observe(el);
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

        {!isFetchingNextPage && !isLoadingDishes && (
          <div ref={handleIntersect} />
        )}

        {(isLoadingDishes || isLoadingWaiters || isFetchingNextPage) && (
          <Loader />
        )}
      </div>
    </div>
  );
};
