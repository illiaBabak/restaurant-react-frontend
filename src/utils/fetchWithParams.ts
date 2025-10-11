type RequestInit = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body: string;
  headers?: Record<string, string>;
};

export const fetchWithParams = async (
  url: string,
  requestInit?: RequestInit
) => {
  const params = new URLSearchParams(window.location.search).toString();

  const response = await fetch(
    `${url}?${params}`,
    requestInit ?? { method: "GET" }
  );

  return response;
};
