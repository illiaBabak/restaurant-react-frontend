import { JSX, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const Search = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("search")) {
      const params = new URLSearchParams(searchParams);
      params.delete("search");
      setSearchParams(params);
    }
  }, [searchParams, setSearchParams]);

  return (
    <input
      type="text"
      defaultValue={searchParams.get("search") ?? ""}
      onBlur={({ target: { value } }) => {
        if (!value) {
          const params = new URLSearchParams(searchParams);
          params.delete("search");
          setSearchParams(params);
          return;
        }

        setSearchParams((prev) => {
          prev.set("search", value);
          return prev;
        });
      }}
      onKeyDown={({ key, currentTarget }) => {
        if (key === "Enter") currentTarget.blur();
      }}
      placeholder="Search"
      className="border-2 border-violet-300 rounded-md p-2 focus:outline-violet-500"
    />
  );
};
