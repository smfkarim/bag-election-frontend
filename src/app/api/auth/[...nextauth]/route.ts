import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type {
    PermissionEnum,
    permissionList,
    RoleEnum,
    roleList,
} from "./../../../../constants/auth.constant";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/user/login`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    }
                );
                const data = await res.json();
                if (!res.ok || !data.token) {
                    throw new Error(data?.error ?? "Wrong credentials");
                }

                return {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    accessToken: data.token,
                    role: data.roles?.[0],
                    permissions: data.permissions,
                };
            },
        }),
    ],

    pages: {
        signIn: "/auth/polling-officer",
    },
    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = String(user?.id) ?? "";
                token.accessToken = user?.accessToken;
                token.role = user.role as RoleEnum;
                token.permissions = user.permissions as PermissionEnum[];
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id ?? "",
                accessToken: token.accessToken,
                role: token.role as (typeof roleList)[number],
                permissions:
                    token.permissions as (typeof permissionList)[number][],
            };
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export const getAuth = async () => {
    const session = (await getServerSession(authOptions)) || {};

    // const role = data?.user.role;
    // const permissions = data?.user?.permissions;

    // function hasAccess(
    //     requiredPermissions: string[],
    //     requiredRoles?: string[]
    // ) {
    //     let authorized = true;
    //     authorized = requiredPermissions?.every((x: string) =>
    //         permissions?.includes(x)
    //     );
    //     if (requiredRoles) {
    //         authorized = requiredRoles.some((x) => x === role);
    //     }

    //     return authorized;
    // }

    // return {
    //     isAuthenticated: status === "authenticated",
    //     isLoading: status === "loading",
    //     status,
    //     role,
    //     permissions,
    //     token: data?.user.accessToken,
    //     hasAccess,
    // };

    return session;
};
