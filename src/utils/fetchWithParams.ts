export type FetchWithParamsProps = {
  apiUrl: string;
  url: string;
  urlParams?: URLSearchParams;
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
};

export const fetchWithParams = async ({
  apiUrl,
  url,
  urlParams,
  headers,
  body,
  method = "GET",
}: FetchWithParamsProps) => {
  const response = await fetch(
    `${apiUrl}/${url}${urlParams ? `?${urlParams.toString()}` : ""}`,
    { method, body, headers }
  );

  return response;
};
