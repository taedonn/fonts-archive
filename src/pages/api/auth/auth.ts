import prisma from '@/libs/client-prisma';

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
            auth: "",
        }
    });

    if (user !== null && user.user_pw === credentials.password) {
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