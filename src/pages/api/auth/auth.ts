import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

async function FetchUserInfo(userId: string) {
    const user = await prisma.fontsUser.findFirst({
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

export async function GetUser(credentials: any) {
    const user = await prisma.fontsUser.findFirst({
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
    const OAuthUser = await prisma.fontsUser.findFirst({
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

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === "GET") {
//         if (req.query.action === "login") {
//             try {
//                 const userId = req.query.id as string;
//                 const userPw = req.query.pw as string;
    
//                 // 유저 정보 불러오기
//                 const user = await prisma.fontsUser.findFirst({
//                     where: {
//                         user_id: userId,
//                         auth: "",
//                     }
//                 });
    
//                 // 로그인 상태
//                 const status = user === null
//                 ? "wrong-id"
//                 : user.user_pw !== userPw
//                     ? "wrong-pw"
//                     : !user.user_email_confirm
//                         ? "not-confirmed"
//                         : "success";
    
//                 // refreshToken 만들고 쿠키에 저장
//                 let refreshToken = "";
//                 status === "success" && user!== null && (
//                     refreshToken = refresh(user.user_id),
//                     await prisma.fontsUser.update({
//                         where: { user_id: userId },
//                         data: { refresh_token: refreshToken }
//                     })
//                 );
    
//                 return res.status(200).json({
//                     msg: "로그인 성공",
//                     status: status,
//                     refreshToken: refreshToken,
//                 });
//             } catch (err) {
//                 return res.status(500).json({
//                     msg: "로그인 실패",
//                     err: err,
//                 });
//             }
//         } else if (req.query.action === "logout") {
//             res.setHeader(
//                 'set-cookie',
//                 `refreshToken=; path=/; max-age=0;`,
//             );
//             res.end();
//         }
//     }
// }