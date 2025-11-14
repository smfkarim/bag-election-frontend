import { parseErrorMessage } from "@/lib/helpers";
import { useAuthStore } from "@/store/auth-store";
import { useDevSettings } from "@/store/dev-settings-store";
import { notifications } from "@mantine/notifications";
import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { signOut } from "next-auth/react";
console.log(useDevSettings.getState().apiBaseUrl, "LL");
const api = axios.create({
    baseURL: useDevSettings.getState().apiBaseUrl,
    timeout: 30000, // 30 seconds
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        // Handle request errors
        if (process.env.NODE_ENV === "development") {
            console.error("Request Error:", error);
        }
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Transform successful responses if needed
        return response;
    },
    (error: AxiosError) => {
        const { response } = error;

        // Handle specific status codes
        if (response?.status === 401) {
            // Clear auth state and redirect to login
            signOut();
            // // Only redirect if not already on login page
            // if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            //     window.location.href = '/auth/login';
            // }
        }

        // Handle 403 Forbidden
        // if (response?.status === 403) {
        //     if (
        //         typeof window !== "undefined" &&
        //         !window.location.pathname.includes("/unauthorized")
        //     ) {
        //         window.location.href = "/unauthorized";
        //     }
        // }

        // Handle network errors
        if (!response) {
            error.message =
                "Network error. Please check your internet connection.";
        }

        // show error message
        notifications.show({
            color: "red",
            title: "Failed",
            message: parseErrorMessage(error as AxiosError),
        });
        return Promise.reject(error);
    }
);

export default api;
