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
            async signIn({ user, account }: { user: any, account: any }) {
                try {
                    // 아이디 이미 존재하는지 확인
                    const hasUser = await HasUser(user);

                    if (hasUser) {
                        const refreshToken = await getRefreshToken(user);
                        setCookie({ res }, "refreshToken", refreshToken, {
                            path: "/",
                            maxAge: 60 * 60 * 24 * 7, // 7d
                            secure: true,
                            sameSite: 'strict',
                        });
                        res.redirect(307, "/");
                    } else {
                        const token = oauthSign(user, account);
                        res.redirect(307, `/user/oauth?token=${token}`);
                    }

                    return true;
                } catch (err) {
                    return false;
                }
            }
        }
    }
}
  
// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
	return NextAuth(req, res, nextAuthOptions(req, res));
};