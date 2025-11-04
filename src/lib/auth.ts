import { PermissionEnum, RoleEnum } from "@/constants/auth.constant";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
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
                if (!res.ok || !data.token) return null;

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

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user?.accessToken;
                token.role = user.role as RoleEnum;
                token.permissions = user.permissions as PermissionEnum[];
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                accessToken: token.accessToken,
                role: token.role,
                permissions: token.permissions,
            };
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
