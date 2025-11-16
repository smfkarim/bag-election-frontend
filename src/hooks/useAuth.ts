import type { PermissionEnum, RoleEnum } from "@/constants/auth.constant";
import { useAuthStore } from "@/store/auth-store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function useAuth() {
    const { status, data } = useSession();
    const role = data?.user.role;
    const permissions = data?.user?.permissions;
    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";

    function hasAccess(
        requiredPermissions: PermissionEnum[],
        requiredRoles?: RoleEnum[]
    ) {
        let authorized = true;
        authorized = requiredPermissions?.every((x) =>
            permissions?.includes(x)
        );
        if (requiredRoles) {
            authorized = requiredRoles.some((x) => x === role);
        }

        return authorized;
    }

    useEffect(() => {
        useAuthStore.setState({
            accessToken: data?.user.accessToken,
            isLoading,
        });
    }, [data]);

    return {
        isAuthenticated,
        isLoading,
        status,
        role,
        permissions,
        token: data?.user.accessToken,
        hasAccess,
        userId: data?.user.id,
    };
}
