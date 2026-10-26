export const getSessionStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

export const setSessionStorage = (key: string, value: unknown) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
};
