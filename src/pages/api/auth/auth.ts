import prisma from '@/libs/prisma';
const bcrypt = require('bcrypt');

export async function FetchUserInfo(id: string, provider: string) {
    const user = await prisma.fontsUser.findFirst({
        where: {
            user_id: id,
            auth: provider,
        }
    });

    return user;
}

/** sendemail.tsx에서 이메일 토큰으로 유저 정보 불러오기 */
export async function FetchUserInfoFromToken(token: string) {
    const user = await prisma.fontsUser.findFirst({
        where: { user_email_token: token }
    });

    return user;
}

/** next-auth credentials 로그인 */
export async function GetUser(credentials: any) {
    const user = await prisma.fontsUser.findFirst({
        select: {
            user_no: true,
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
            auth: "credentials",
        }
    });

    if (user !== null && bcrypt.compareSync(credentials.password, user.user_pw)) {
        const sessionUser = {};

        // Session의 기본 키 값과 동일하게 맞춰줌
        Object.assign(sessionUser, {
            id: user.user_no,
            email: user.user_id,
            name: user.user_name,
            image: user.profile_img
        });
        return sessionUser;
    }
    else return null;
}

/** next-auth oauth 로그인 */
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
            auth: account.provider,
        } 
    });

    if (OAuthUser === null) { // OAuth 유저가 등록이 안되어 있으면 OAuth 유저 등록
        await prisma.fontsUser.create({
            data: {
                user_name: user.name === undefined ? user.email.split("@")[0] : user.name,
                user_id: user.email,
                user_pw: "",
                user_email_token: "",
                user_email_confirm: true,
                auth: account.provider,
                profile_img: user.image === undefined ? "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg" : user.image,
                public_img: "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg"
            }
        });
        return true;
    } else if (OAuthUser.profile_img !== user.image) { // OAuth 프로필 이미지랑 등록된 프로필 이미지랑 다르면 프로필 이미지 업데이트
        await prisma.fontsUser.updateMany({
            where: {
                user_id: user.email,
                auth: account.provider,
            },
            data: { profile_img: user.image }
        });
        return true;
    } else return true; // OAuth 유저가 등록되어 있고 프로필 이미지도 일치하면 return true
}

export async function GetOAuthUserInfo(user: any, account: any) {
    const OAuthUser = await prisma.fontsUser.findFirst({
        select: {
            user_no: true,
            user_id: true,
            user_name: true,
            auth: true,
            protected: true,
            public_img: true,
        },
        where: {
            user_id: user.email,
            auth: account.provider,
        }
    });

    return OAuthUser;
}