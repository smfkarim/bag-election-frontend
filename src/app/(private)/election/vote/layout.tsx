"use client";
import { notifications } from "@mantine/notifications";
import cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

export default function VoteLayout(props: PropsWithChildren) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (cookie.get("isVoter") === "1") {
            setIsLoading(false);
        } else {
            notifications.show({
                color: "red",
                message: "Unauthorized access",
            });
            router.back();
        }
    }, []);

    if (isLoading) return null;
    return <div>{props.children}</div>;
}
