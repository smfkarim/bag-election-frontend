import { PermissionEnum, RoleEnum } from "@/constants/auth.constant";
import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | number;
      name?: string | null;
      email?: string | null;
      accessToken?: string;
      role?: RoleEnum;
      permissions?: PermissionEnum[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string | number;
    accessToken?: string;
    role?: string;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: RoleEnum;
    permissions?: PermissionEnum[];
  }
}
