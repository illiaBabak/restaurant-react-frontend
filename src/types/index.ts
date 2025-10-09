import { DISHES_CATEGORIES } from "src/utils/constants";

type WaiterBase = {
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  address: string;
};

export type Waiter = WaiterBase & { id: string };

export type NewWaiter = WaiterBase;

type DishBase = {
  name: string;
  price: number;
  weight: number;
  category: (typeof DISHES_CATEGORIES)[number];
};

export type Dish = DishBase & { id: string };

export type NewDish = DishBase;

type BillBase = {
  created_at: string;
  waiter_id: string;
  dishes: {
    dish_id: string;
    quantity: number;
  }[];
};

export type Bill = BillBase & { id: string };

export type NewBill = BillBase;

export type Response<T> = {
  data: T;
  error: null;
};

export type AlertProps = {
  text: string;
  type: "success" | "error";
  position: "top" | "bottom";
};
