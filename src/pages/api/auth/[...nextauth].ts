import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import { getRefreshToken } from "./oauth";
import { setCookie } from "nookies";

const nextAuthOptions = (req: NextApiRequest, res: NextApiResponse) => {
    return {
        providers: [
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
            async signIn({ user }: { user: any }) {
                try {
                    const refreshToken = await getRefreshToken(user);
                    setCookie({ res }, "refreshToken", refreshToken, {
                        path: "/",
                        maxAge: 60 * 60 * 24 * 30, // 1m
                        secure: true,
                        sameSite: 'strict',
                    });

                    return true;
                } catch (err) {
                    return false;
                }
            },
        }
    }
}
  
export default (req: NextApiRequest, res: NextApiResponse) => {
	return NextAuth(req, res, nextAuthOptions(req, res));
};