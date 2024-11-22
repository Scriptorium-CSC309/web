/**
 * Collection of helper functions to storage access and refresh tokens in the browser's local storage.
 */

export const getAccessToken = (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

export const getRefreshToken = (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

export const setAccessToken = (token: string) =>
    localStorage.setItem("accessToken", token);

export const setRefreshToken = (token: string) =>
    localStorage.setItem("refreshToken", token);

export const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};
