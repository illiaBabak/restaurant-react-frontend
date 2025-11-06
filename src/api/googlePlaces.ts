import { fetchWithParams } from "src/utils/fetchWithParams";
import { isSuggestionsResponse } from "src/utils/guards";
import { SuggestionsResponse } from "src/types";
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { GOOGLE_PLACES_QUERY } from "./constants";

const key = import.meta.env.ENV_GOOGLE_API_KEY;

const getPlaces = async (
  query: string
): Promise<SuggestionsResponse | null> => {
  const response = await fetchWithParams({
    apiUrl: "https://places.googleapis.com/v1",
    urlParams: new URLSearchParams({
      key,
    }),
    url: "places:autocomplete",
    method: "POST",
    body: JSON.stringify({
      input: query,
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Goog-FieldMask":
        "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get places");
  }

  const data = await response.json();
  console.log(data);
  return isSuggestionsResponse(data) ? data : null;
};

export const useGooglePlaceSuggestions = (
  query: string,
  options?: Partial<UseQueryOptions<SuggestionsResponse | null, Error>>
): UseQueryResult<SuggestionsResponse | null, Error> =>
  useQuery({
    queryKey: [GOOGLE_PLACES_QUERY, query],
    queryFn: () => getPlaces(query),
    ...options,
  });
