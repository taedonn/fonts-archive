import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
import { refresh, refreshVerify, sign, verify } from '@/libs/jwt-utils';

async function FetchUserInfo(userId: string) {
    const user = await prisma.fontsUser.findUnique({
        where: { user_id: userId }
    });

    return user;
}

export async function FetchUserInfoFromToken(token: string) {
    const user = await prisma.fontsUser.findFirst({
        where: { user_email_token: token }
    });

    return user;
}

export async function Auth(accessToken: string) {
    const payload = verify(accessToken);
    const user = await FetchUserInfo(payload.userId);
    
    return user;
}

export async function getAccessToken(refreshToken: string) {
    const user = refreshVerify(refreshToken)
        ? await prisma.fontsUser.findFirst({
            select: { user_id: true },
            where: { refresh_token: refreshToken }
        })
        : null;

    const accessToken = user === null
        ? null
        : sign(user.user_id);

    return accessToken;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.action === "login") {
            try {
                const userId = req.query.id as string;
                const userPw = req.query.pw as string;
                const stayLoggedIn = req.query.stay_logged_in;
    
                // 유저 정보 불러오기
                const user = await prisma.fontsUser.findUnique({
                    where: { user_id: userId }
                });
    
                // 로그인 상태
                const status = user === null
                ? "wrong-id"
                : user.user_pw !== userPw
                    ? "wrong-pw"
                    : !user.user_email_confirm
                        ? "not-confirmed"
                        : "success";
    
                // refreshToken 만들고 쿠키에 저장
                let refreshToken = "";
                status === "success" && user!== null && (
                    refreshToken = refresh(user.user_id),
                    await prisma.fontsUser.update({
                        where: { user_id: userId },
                        data: { refresh_token: refreshToken }
                    })
                );
    
                return res.status(200).json({
                    msg: "로그인 성공",
                    status: status,
                    refreshToken: refreshToken,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "로그인 실패",
                    err: err,
                });
            }
        } else if (req.query.action === "logout") {
            res.setHeader(
                'set-cookie',
                `refreshToken=; path=/; max-age=0;`,
            );
            res.end();
        }
    }
}