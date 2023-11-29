import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
import { refresh, sign } from '@/libs/jwt-utils';
import { verify } from 'crypto';

async function CheckIfSessionExists(session: string) {
    const user = await prisma.fontsUser.findFirst({
        select: { user_session_id: true },
        where: { user_session_id: session }
    });

    return user ? true : false;
}

async function FetchUserInfo(session: string) {
    const user = await prisma.fontsUser.findFirst({
        where: { user_session_id: session }
    });

    return user;
}

export async function FetchUserInfoFromToken(token: string) {
    const user = await prisma.fontsUser.findFirst({
        where: { user_email_token: token }
    });

    return user;
}

export async function Auth(session: string, res: any) {
    // 유저 정보 조회
    const user = session === undefined
        ? null
        : await CheckIfSessionExists(session)
            ? await FetchUserInfo(session)
            : null;

    // 유저 정보 없으면 쿠키에서 session 제거
    user === null && res.setHeader('Set-Cookie', [`session=deleted; max-Age=0; path=/`]);

    return user;
}

// async function getAccessToken(refreshToken: string) {
//     const userId = await prisma.fontsUser.findFirst({
//         select: { user_id: true },
//         where: { refresh_token: refreshToken }
//     });

//     return userId;
// }

// export async function Auth(refreshToken: string) {
//     // 유저 정보 조회
//     const userId = refreshToken === undefined
//         ? null
//         : await getAccessToken(refreshToken)

//     return userId;
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const userId = req.query.id as string;
            const userPw = req.query.pw as string;

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

            // 토큰만들기
            const refreshToken = refresh(userId);
            const accessToken = sign(userId);

            // DB에 고유한 refreshToken 저장
            user !== null && status === "success" && await prisma.fontsUser.update({
                where: { user_id: user.user_id },
                data: { refresh_token: refreshToken }
            });

            // Refresh Token은 쿠키에 담아 보내줌
            res.setHeader(
                'Set-Cookie',
                `refreshToken=${refreshToken}; Path=/; Expires=${new Date(Date.now() + 60 * 60 * 24 * 1000 * 3,).toUTCString()}; HttpOnly`,
            );

            return res.status(200).json({
                msg: "로그인 성공",
                status: status,
                access_token: accessToken,
            });
        } catch (err) {
            return res.status(500).json({
                msg: "로그인 실패",
                err: err,
            });
        }
    }
}