/*
 * Defines a new axios instance to help with sending HTTP requests to the API
 * by automatically refreshing the access token using the refresh token if required.
 */

import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    clearTokens,
} from "./token-storage";

/*
 * Internally, this works by intercepting sent requests and responses.
 * First, the Bearer auth is automatically added to the request header.
 * Next, if the response's status code is 401 unauthorized, a refresh is initiated.
 * Note that multilple refreshes are unneccessary, hence a failedQueue is used
 * to store previously unauthorized requests. Once the refresh is successful, these
 * failed requests are retried with the newly refreshed access token.
 */

// The axios object to facilitate automatic refreshes.
const api = axios.create({
    baseURL: "/api", // Replace with your actual base URL
});

/**
 * An item in the failed request queue.
 */
interface FailedQueueItem {
    /**
     * The function that will be called when the refresh is successful.
     *
     * @param token - The new access token obtained from the refresh operation.
     */
    resolve: (token: string) => void;

    /**
     * The function that will be called when the refresh fails.
     *
     * @param error - The error object containing details of the failure.
     */
    reject: (error: AxiosError) => void;
}

/* Clear tokens and redirect to the login page.*/
const redirectToLogin = () => {
    clearTokens();
    window.location.href = "auth/login"; // Replace "/login" with your login page route
};

/* Flag to indicate if a refresh operation is currently in progress. */
let isRefreshing = false;

/* Queue to store requests that failed due to an unauthorized request (401 response). */
let failedQueue: FailedQueueItem[] = [];

// Request interceptor to attach the access token to headers
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error) // if the error is in the request itself, just let the error propogate
);

/**
 * Processes a queue of failed requests, resolving or rejecting each promise based on the provided error or token.
 *
 * @param {AxiosError | null} error - The error object if the request failed, or null if there is no error.
 * @param {string | null} [token=null] - The new access token, or null if no token is available even after a refresh.
 */
const processQueue = (
    error: AxiosError | null,
    token: string | null = null
) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        } else {
            prom.reject(new AxiosError("Token is null"));
        }
    });

    failedQueue = [];
};

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response: AxiosResponse) => response, // if there is no error, let the response pass through
    (error: AxiosError) => {
        const originalRequest: any = error.config;

        // recieved an unauthorized response and the original request has not been retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token: string) => {
                        if (originalRequest.headers) {
                            originalRequest.headers["Authorization"] =
                                "Bearer " + token;
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                clearTokens();
                // redirectToLogin();
                return Promise.reject(error);
            }

            return new Promise((resolve, reject) => {
                axios
                    .post("/api/auth/refresh", { refreshToken })
                    .then(({ data }) => {
                        setAccessToken(data.accessToken);
                        if (originalRequest.headers) {
                            originalRequest.headers["Authorization"] =
                                "Bearer " + data.accessToken;
                        }
                        processQueue(null, data.accessToken);
                        resolve(api(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        clearTokens();
                        // redirectToLogin();
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default api;
