import { JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "src/utils/constants";
import { capitalize } from "src/utils/capitalize";

export const Header = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const routeToNavigate =
    location.pathname === ROUTES.admin ? ROUTES.receipt : ROUTES.admin;

  const handleNavigate = () => {
    navigate(routeToNavigate);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-neutral-100 h-[60px]">
      <h2 className="text-xl font-bold tracking-wide">Dashboard</h2>
      <button
        className="bg-violet-500 text-white px-4 py-2 rounded-md cursor-pointer transition-all duration-300 hover:bg-violet-600 w-[90px]"
        onClick={handleNavigate}
      >
        {capitalize(routeToNavigate.slice(1))}
      </button>
    </div>
  );
};
