import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
import { refresh, oauthVerify } from '@/libs/jwt-utils';

export async function getRefreshToken(snsUser: any) {
    const refreshToken = refresh(snsUser.email)
    await prisma.fontsUser.update({
        where: { user_id: snsUser.email },
        data: { refresh_token: refreshToken }
    });

    return refreshToken;
}

// 유저 정보 있는지 조회
export async function HasUser(oauth_user: any) {
    const user = await prisma.fontsUser.findUnique({
        where: { user_id: oauth_user.email }
    });

    return user !== null ? true : false;
}

// OAUTH 유저 AccessToken 검증
export async function verifyAccessToken(token: string) {
    const user = oauthVerify(token);

    return user;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.action === "check-id") {
            try {
                const user = await prisma.fontsUser.findUnique({
                    where: { user_id: req.query.id as string }
                });
            
                return res.status(200).json({
                    msg: "이메일 중복 체크 성공",
                    check: user === null ? false : true,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "이메일 중복 체크 실패"
                });
            }
        }
    } else if (req.method === "POST") {
        if (req.body.action === "register") {
            try {
                const { name, id, image } = req.body;
                const emailToken = crypto.randomUUID();

                await prisma.fontsUser.create({
                    data: {
                        user_name: name,
                        user_id: id,
                        user_pw: "",
                        auth: "oauth",
                        user_email_token: emailToken,
                        user_email_confirm: false,
                        profile_img: image === "" || image === undefined ? "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg" : image
                    }
                });
                
                return res.status(200).json({
                    msg: "회원가입 성공",
                    emailToken: emailToken,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "회원가입 실패"
                });
            }
        }
    }
}