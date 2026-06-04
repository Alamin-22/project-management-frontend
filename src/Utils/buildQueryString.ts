export const buildQueryString = (
  searchParams: { [key: string]: string | string[] | undefined },
  defaultLimit: number = 24,
): string => {
  const queryParams = new URLSearchParams();

  // Set the default limit
  queryParams.set("limit", String(defaultLimit));

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) queryParams.append(key, v);
      });
    } else if (value) {
      queryParams.set(key, value);
    }
  });

  return queryParams.toString();
};
