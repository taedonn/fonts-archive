import prisma from '@/libs/client-prisma';

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