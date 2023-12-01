import prisma from '@/libs/client-prisma';
import { refresh } from '@/libs/jwt-utils';

export async function getRefreshToken(snsUser: any) {
    let refreshToken = "";

    // 유저 정보 조회
    const user = await prisma.fontsUser.findUnique({
        where: { user_id: snsUser.email }
    });

    // 유저 정보가 있으면, 유저 정보에 refreshToken 저장
    user !== null && (
        refreshToken = refresh(user.user_id),
        await prisma.fontsUser.update({
            where: { user_id: user.user_id },
            data: { refresh_token: refreshToken }
        })
    );

    // 유저 정보가 없을 경우, 새 유저 정보 생성 후 refreshToken 저장
    user === null && (
        refreshToken = refresh(snsUser.email),
        await prisma.fontsUser.create({
            data: {
                user_name: snsUser.name,
                user_id: snsUser.email,
                user_pw: "",
                auth: "oauth",
                refresh_token: refreshToken,
                user_email_token: "",
                user_email_confirm: true,
                profile_img: snsUser.image === undefined ? "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg" : snsUser.image
            }
        })
    );

    return refreshToken;
}