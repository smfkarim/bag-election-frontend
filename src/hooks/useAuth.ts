import { useSession } from "next-auth/react";

export default function useAuth() {
    const { status, update, data } = useSession();
    const role = data?.user.role;
    const permissions = data?.user?.permissions;

    function hasAccess(
        requiredPermissions: string[],
        requiredRoles?: string[]
    ) {
        let authorized = true;
        authorized = requiredPermissions?.every((x: string) =>
            permissions?.includes(x)
        );
        if (requiredRoles) {
            authorized = requiredRoles.some((x) => x === role);
        }

        return authorized;
    }

    return {
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        status,
        role,
        permissions,
        token: data?.user.accessToken,
        hasAccess,
    };
}
