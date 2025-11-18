import { Button } from "@mantine/core";
import { signOut } from "next-auth/react";

export default function Header() {
    return (
        <div className=" flex justify-between  w-full my-5">
            <h1>BAG Election System</h1>
            <Button
                size="xs"
                onClick={() => {
                    signOut({
                        redirect: true,
                        callbackUrl: "/auth/polling-officer",
                    });
                }}
                variant="outline"
                color="violet"
            >
                {" "}
                Logout
            </Button>
        </div>
    );
}
