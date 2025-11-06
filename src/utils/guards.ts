import {
  Waiter,
  Response,
  Dish,
  PageResponse,
  SuggestionsResponse,
} from "src/types";

export const isString = (value: unknown): value is string =>
  typeof value === "string";

export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isWaiter = (value: unknown): value is Waiter =>
  isObject(value) &&
  "id" in value &&
  isString(value.id) &&
  "name" in value &&
  isString(value.name) &&
  "surname" in value &&
  isString(value.surname) &&
  "email" in value &&
  isString(value.email) &&
  "phone_number" in value &&
  isString(value.phone_number) &&
  "address" in value &&
  isString(value.address);

export const isWaiters = (value: unknown): value is Waiter[] =>
  Array.isArray(value) && value.every(isWaiter);

export const isWaitersResponse = (
  value: unknown
): value is Response<Waiter[]> =>
  isObject(value) && "data" in value && isWaiters(value.data);

export const isDish = (value: unknown): value is Dish =>
  isObject(value) &&
  "id" in value &&
  isString(value.id) &&
  "name" in value &&
  isString(value.name) &&
  "weight" in value &&
  isNumber(value.weight) &&
  "category" in value &&
  isString(value.category) &&
  "price" in value &&
  isNumber(value.price);

export const isDishes = (value: unknown): value is Dish[] =>
  Array.isArray(value) && value.every(isDish);

export const isDishesResponse = (value: unknown): value is Response<Dish[]> =>
  isObject(value) && "data" in value && isDishes(value.data);

export const isDishesPageResponse = (
  value: unknown
): value is PageResponse<Dish[]> =>
  isObject(value) &&
  "data" in value &&
  isObject(value.data) &&
  "totalPages" in value.data &&
  isNumber(value.data.totalPages) &&
  "currentPageNumber" in value.data &&
  isNumber(value.data.currentPageNumber) &&
  "pageSize" in value.data &&
  isNumber(value.data.pageSize) &&
  "totalCount" in value.data &&
  isNumber(value.data.totalCount) &&
  "pageData" in value.data &&
  isDishes(value.data.pageData);

export const isWaitersPageResponse = (
  value: unknown
): value is PageResponse<Waiter[]> =>
  isObject(value) &&
  "data" in value &&
  isObject(value.data) &&
  "totalPages" in value.data &&
  isNumber(value.data.totalPages) &&
  "currentPageNumber" in value.data &&
  isNumber(value.data.currentPageNumber) &&
  "pageSize" in value.data &&
  isNumber(value.data.pageSize) &&
  "totalCount" in value.data &&
  isNumber(value.data.totalCount) &&
  "pageData" in value.data &&
  isWaiters(value.data.pageData);

export const isSuggestionsResponse = (
  value: unknown
): value is SuggestionsResponse =>
  isObject(value) &&
  "suggestions" in value &&
  Array.isArray(value.suggestions) &&
  value.suggestions.every(
    (el) =>
      isObject(el) &&
      "placePrediction" in el &&
      isObject(el.placePrediction) &&
      "placeId" in el.placePrediction &&
      isString(el.placePrediction.placeId) &&
      "text" in el.placePrediction &&
      isObject(el.placePrediction.text) &&
      "text" in el.placePrediction.text &&
      isString(el.placePrediction.text.text)
  );
