import { DISHES_CATEGORIES } from "src/utils/constants";

export type Waiter = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  address: string;
};

export type Dish = {
  id: string;
  name: string;
  price: number;
  weight: number;
  category: (typeof DISHES_CATEGORIES)[number];
};

export type Response<T> = {
  data: T;
  error: null;
};

export type AlertProps = {
  text: string;
  type: "success" | "error";
  position: "top" | "bottom";
};
