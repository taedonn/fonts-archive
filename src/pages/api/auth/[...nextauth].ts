import NextAuth from "next-auth"
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import { GetUser, GetOAuthUser, GetOAuthUserInfo } from "./auth";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "아이디를 입력해 주세요." },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user: any = await GetUser(credentials);
                if (user) return user;
                else return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_PW as string,
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_OAUTH_CLIENT_ID as string,
            clientSecret: process.env.KAKAO_OAUTH_CLIENT_PW as string,
        }),
    ],
    callbacks: {
        async signIn({ user, account }: any) {
            if (account.provider === "credentials") {
                return true;
            } else {
                const hasUser = await GetOAuthUser(user, account);
                return hasUser;
            }
        },
        async jwt({ token, user, account }: any) {
            if (user) {
                if (account.provider === "credentials") {
                    Object.assign(token, {
                        sub: user.id,
                        provider: account.provider
                    });
                } else {
                    const OAuthUser = await GetOAuthUserInfo(user, account);
                    Object.assign(token, {
                        sub: OAuthUser === null ? 0 : OAuthUser.user_no,
                        provider: account.provider
                    });
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session?.user) {
                Object.assign(session.user, {
                    id: token.sub,
                    provider: token.provider
                });
            }
            return session;
        }
    }
}

export default NextAuth(authOptions);