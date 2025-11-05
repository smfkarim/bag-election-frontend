import { permissionList, roleList } from "@/constants/auth.constant";

export type Permission = (typeof permissionList)[number];
export type Role = (typeof roleList)[number];
