import { ErrorResponse } from "@/@types";
import { AxiosError } from "axios";

export const parseErrorMessage = (
    error: Error | ErrorResponse,
    fallbackMessage: string = "Something went wrong"
) => {
    if (error instanceof AxiosError) {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message
        );
    }
    return error?.message || fallbackMessage;
};

export const getBucketURL = (path: string) =>
    `${process.env.NEXT_PUBLIC_BUCKET_URL}${path}`;
