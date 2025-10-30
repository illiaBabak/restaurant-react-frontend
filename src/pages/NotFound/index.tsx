import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "src/utils/constants";

export const NotFound = (): JSX.Element => {
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (countdown === 0) {
        navigate(ROUTES.admin);
        return;
      }

      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [navigate, countdown, setCountdown]);

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-violet-500 mb-4">404</h1>
          <div className="w-24 h-1 bg-violet-400 mx-auto rounded-full"></div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-wide">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Oops! The page you're looking for doesn't exist. Don't worry, we'll
            get you back on track.
          </p>
        </div>

        <div className="mb-8 p-4 bg-white rounded-xl shadow-md border-2 border-violet-100">
          <p className="text-gray-700 mb-2">Redirecting to Dashboard in</p>
          <div className="text-4xl font-bold text-violet-500 mb-2">
            {countdown}
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-violet-500 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => navigate(ROUTES.admin)}
          className="bg-violet-500 text-white px-8 py-3 rounded-md cursor-pointer transition-all duration-300 hover:bg-violet-600 hover:shadow-lg transform hover:-translate-y-1 font-medium tracking-wide text-lg"
        >
          Go to Dashboard Now
        </button>

        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-violet-300 rounded-full animate-pulse"></div>
          <div
            className="w-3 h-3 bg-violet-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-violet-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
