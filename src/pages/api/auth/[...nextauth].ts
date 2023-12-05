import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import { getRefreshToken, HasUser } from "./oauth";
import { oauthSign } from '@/libs/jwt-utils';
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
                    // const refreshToken = await getRefreshToken(user);
                    // setCookie({ res }, "refreshToken", refreshToken, {
                    //     path: "/",
                    //     maxAge: 60 * 60 * 24 * 30, // 1m
                    //     secure: true,
                    //     sameSite: 'strict',
                    // });

                    // if (hasUser) {
                    //     res.redirect(307, "/");
                    // } else {
                    //     res.redirect(307, '/oauth');
                    // }

                    const hasUser = await HasUser(user);
                    const token = oauthSign(user);
                    
                    hasUser
                        ? res.redirect(307, "/")
                        : res.redirect(307, `/user/oauth?token=${token}`);

                    return true;
                } catch (err) {
                    return false;
                }
            }
            // async jwt({ token, user, account }: { token: any, user: any, account: any }) {
            //     if (user) {
            //         token = {
            //             email: user.id,
            //             name: user.name,
            //             image: user.image,
            //             provider: account.provider,
            //         }

            //         const hasUser = await HasUser(user);
            //         if (hasUser) {
            //             res.redirect(307, "/");
            //         } else {
            //             res.redirect(307, `/oauth?token=${token}`);
            //         }
            //     }

            //     return token;
            // }
        }
    }
}
  
// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
	return NextAuth(req, res, nextAuthOptions(req, res));
};