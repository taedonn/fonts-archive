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
export async function HasUser(credentials: any) {
    const user = await prisma.fontsUser.findUnique({
        where: { user_id: credentials.email } 
    });

    if (user !== null && user.user_pw === credentials.password) return true;
    else return false;
    
    // const user = await prisma.fontsUser.findUnique({
    //     where: {
    //         user_id: oauth_user.email,
    //         auth: oauth_account.provider,
    //     }
    // });

    // return user === null ? false : true;
}

// OAUTH 유저 AccessToken 검증
export async function verifyAccessToken(token: string) {
    const user = oauthVerify(token);

    return user;
}

export async function GetUser(credentials: any) {
    const user = await prisma.fontsUser.findUnique({
        select: {
            user_id: true,
            user_pw: true,
            user_name: true,
            user_email_confirm: true,
            auth: true,
            profile_img: true,
        },
        where: {
            user_id: credentials.email,
            user_email_confirm: true,
            auth: "",
        } 
    });

    if (user !== null && user.user_pw === credentials.password) {
        const sessionUser = {};

        // Session의 기본 키 값과 동일하게 맞춰줌
        Object.assign(sessionUser, {
            email: user.user_id,
            name: user.user_name,
            image: user.profile_img
        });
        return sessionUser;
    }
    else return null;
}

export async function GetOAuthUser(user: any, account: any) {
    const OAuthUser = await prisma.fontsUser.findUnique({
        select: {
            user_id: true,
            user_pw: true,
            user_name: true,
            auth: true,
            profile_img: true,
        },
        where: {
            user_id: user.email,
        } 
    });

    if (OAuthUser === null) {
        await prisma.fontsUser.create({
            data: {
                user_name: user.name,
                user_id: user.email,
                user_pw: "",
                user_email_token: "",
                user_email_confirm: true,
                auth: account.provider,
                profile_img: user.image === undefined || user.image === "" ? "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg" : user.image
            }
        });

        return true;
    }
    else {
        return true;
    }
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
                const { name, id, image, provider } = req.body;
                const emailToken = crypto.randomUUID();

                await prisma.fontsUser.create({
                    data: {
                        user_name: name,
                        user_id: id,
                        user_pw: "",
                        auth: provider,
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