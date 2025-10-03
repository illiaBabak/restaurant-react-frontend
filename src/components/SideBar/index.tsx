import { JSX } from "react";
import { useSearchParams } from "react-router";
import { TABLES_TYPES } from "src/utils/constants";

export const SideBar = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTable = searchParams.get("table") ?? TABLES_TYPES[0];

  return (
    <div className="flex flex-col p-4 gap-5 shadow-md w-[320px] h-full">
      <h2 className="text-2xl font-bold tracking-wide">Tables</h2>
      <div className="flex flex-col gap-2">
        {TABLES_TYPES.map((table, index) => (
          <h3
            onClick={() => setSearchParams({ table: table })}
            key={`${table}-${index}`}
            className={`text-base tracking-wide cursor-pointer border-2 border-transparent px-3 py-2 ${
              selectedTable === table ? "border-violet-400 rounded-xl" : ""
            }`}
          >
            {table}
          </h3>
        ))}
      </div>
    </div>
  );
};
