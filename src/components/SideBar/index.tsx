import { JSX, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TABLES_CATEGORIES } from "src/utils/constants";

export const SideBar = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("table-category"))
      setSearchParams((prev) => {
        prev.set("table-category", "Waiters");
        return prev;
      });
  }, [searchParams, setSearchParams]);

  const selectedCategory = searchParams.get("table-category") ?? "Waiters";

  const changeCategory = (category: string) => {
    setSearchParams({ "table-category": category, page: "1" });
  };

  return (
    <div className="flex flex-col justify-center items-center lg:items-stretch lg:justify-start p-4 gap-5 shadow-md lg:w-[320px] w-full h-full">
      <h2 className="text-2xl font-bold tracking-wide">Tables</h2>
      <div className="flex flex-col w-[300px] lg:w-auto gap-2">
        {TABLES_CATEGORIES.map((category, index) => (
          <h3
            data-testid={`${category}-sidebar-btn`}
            onClick={() => changeCategory(category)}
            key={`${category}-${index}`}
            className={`text-base w-full lg:w-auto tracking-wide lg:text-start text-center cursor-pointer border-2 border-transparent px-3 py-2 rounded-xl transition-all duration-300 ease-in-out hover:border-violet-300 hover:shadow-sm ${
              selectedCategory === category ? "border-violet-400 shadow-md" : ""
            }`}
          >
            {category}
          </h3>
        ))}
      </div>
    </div>
  );
};
