import { useSession } from "next-auth/react";
import type { PermissionEnum, RoleEnum } from "@/constants/auth.constant";

export default function useAuth() {
  const { status, update, data } = useSession();
  const role = data?.user.role;
  const permissions = data?.user?.permissions;

  function hasAccess(
    requiredPermissions: PermissionEnum[],
    requiredRoles?: RoleEnum[],
  ) {
    let authorized = true;
    authorized = requiredPermissions?.every((x) => permissions?.includes(x));
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
