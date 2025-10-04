export type Waiter = {
  _id: {
    $oid: string;
  };
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  address: string;
};

export type Response<T> = {
  data: T;
  error: null;
};

export type Dish = {
  _id: {
    $oid: string;
  };
  name: string;
  price: number;
  weight: number;
  category: string;
};
