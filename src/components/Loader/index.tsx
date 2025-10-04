import { JSX } from "react";

export const Loader = (): JSX.Element => (
  <div className="flex justify-center items-center fixed right-[8px] bottom-[8px]">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 border-r-purple-500 rounded-full animate-spin"></div>
    </div>
  </div>
);
